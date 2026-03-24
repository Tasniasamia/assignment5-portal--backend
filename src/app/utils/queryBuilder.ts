import status from "http-status";
import type { IQueryParams } from "../interfaces/query.interface";
import  { prisma } from "../lib/prisma";
import { AppError } from "../errorHelplers/appError";
// import { AppError } from "../../errorHelplers/appError";
// import type { IQueryParams } from "../../interfaces/query.interface";
// import { prisma } from "../../lib/prisma";

export class QueryBuilder {
  query: IQueryParams;
  model: keyof typeof prisma;

  page: number;
  skip: number;
  take: number;

  sortBy: string;
  sortOrder: "asc" | "desc";
  orderBy:
    | Record<string, "asc" | "desc">
    | Record<string, Record<string, "asc" | "desc">> = {};

  searchCondition: Record<string, unknown>[] = [];
  numberSearchFields: string[] = [];
  stringSearchFields: string[] = [];
  searchItem?: string | undefined;

  filterCondition: Record<string, unknown>[] = [];
  include: Record<string, unknown> = {};
  singleRelations: string[] = [];
booleanFields:string[]=[]
  constructor(
    query: IQueryParams,
    model: keyof typeof prisma,
    numberSearchFields?: string[],
    stringSearchFields?: string[],
    booleanFields?:string[],
    singleRelations?: string[],
  ) {
    this.query = query;
    this.model = model;
    this.page = Number(this.query?.page) || 1;
    this.take = Number(this.query?.limit) || 10;
    this.skip = (this.page - 1) * this.take;
    this.sortOrder = this.query?.sortOrder ?? "desc";
    this.sortBy = this.query.sortBy || "createdAt";
    this.numberSearchFields = numberSearchFields || [];
    this.stringSearchFields = stringSearchFields || [];
    this.searchItem = this.query?.searchTerm || undefined;
    this.singleRelations = singleRelations || [];
    this.booleanFields = booleanFields || [];
  }

  private parseValue(value: unknown): unknown {
    if (value === "true") return true;
    if (value === "false") return false;
    const numericValue = Number(value);
    if (!isNaN(numericValue) && value !== "") return numericValue;
    return value;
  }

  // innermost field value বানায় — bracketMatch, array, normal সব handle করে
  private buildFieldValue(
    actualField: string,
    value: unknown,
    bracketMatch: RegExpMatchArray | null,
  ): Record<string, unknown> {
    if (bracketMatch) {
      const [, fieldName, operator] = bracketMatch;
      return {
        [fieldName as string]: {
          [operator as string]: this.parseValue(value),
        },
      };
    }
    if (Array.isArray(value)) {
      return {
        [actualField]: { in: value.map((v) => this.parseValue(v)) },
      };
    }
    return {
      [actualField]: this.parseValue(value),
    };
  }

  sort() {
    const parts = this.sortBy.split(".");
    if (parts.length > 2) {
      throw new AppError(status.BAD_REQUEST, "Sorting only works with two levels of nesting");
    }
    if (parts.length === 2) {
      const [relation, field] = parts;
      this.orderBy = { [relation as string]: { [field as string]: this.sortOrder } };
    } else {
      this.orderBy = { [this.sortBy]: this.sortOrder };
    }
  }

  // search() {
  //   if (this.searchItem) {
  //     const numericValue = Number(this.searchItem);
  //     if (!isNaN(numericValue)) {
  //       this.numberSearchFields?.forEach((item: string) => {
  //         if (item.includes(".")) {
  //           const exactFieldofSearch = item.split(".");
  //           if (exactFieldofSearch.length === 3) {
  //             const [relation, subRelation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 some: {
  //                   [subRelation as string]: {
  //                     [field as string]: Number(this.searchItem),
  //                   },
  //                 },
  //               },
  //             });
  //           } else if (exactFieldofSearch.length === 2) {
  //             const [relation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: { [field as string]: Number(this.searchItem) },
  //             });
  //           }
  //         }
  //         this.searchCondition.push({ [item as string]: Number(this.searchItem) });
  //       });
  //     } else {
  //       this.stringSearchFields?.forEach((item: string) => {
  //         if (item.includes(".")) {
  //           const exactFieldofSearch = item.split(".");
  //           if (exactFieldofSearch.length === 3) {
  //             const [relation, subRelation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 some: {
  //                   [subRelation as string]: {
  //                     [field as string]: {
  //                       contains: this.searchItem as string,
  //                       mode: "insensitive",
  //                     },
  //                   },
  //                 },
  //               },
  //             });
  //           } else if (exactFieldofSearch.length === 2) {
  //             const [relation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 [field as string]: {
  //                   contains: this.searchItem as string,
  //                   mode: "insensitive",
  //                 },
  //               },
  //             });
  //           }
  //         } else if (!item.includes(".")) {
  //           this.searchCondition.push({
  //             [item as string]: {
  //               contains: this.searchItem as string,
  //               mode: "insensitive",
  //             },
  //           });
  //         }
  //       });
  //     }
  //   }
  // }
search() {
  if (!this.searchItem) return;

  const numericValue = Number(this.searchItem);
  const isBooleanValue = this.searchItem === "true" || this.searchItem === "false";

  // ─── Number search ───────────────────────────────────────────
  if (!isNaN(numericValue) && !isBooleanValue) {
    this.numberSearchFields?.forEach((item: string) => {
      if (item.includes(".")) {
        const parts = item.split(".");

        if (parts.length === 3) {
          const [relation, subRelation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const subUsesSome = !this.singleRelations.includes(subRelation as string);

          const innerValue = { [field as string]: numericValue };
          const subLevel = subUsesSome ? { some: innerValue } : innerValue;

          this.searchCondition.push({
            [relation as string]: relUsesSome
              ? { some: { [subRelation as string]: subLevel } }
              : { [subRelation as string]: subLevel },
          });

        } else if (parts.length === 2) {
          const [relation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const innerValue = { [field as string]: numericValue };

          this.searchCondition.push({
            [relation as string]: relUsesSome ? { some: innerValue } : innerValue,
          });
        }
      } else {
        this.searchCondition.push({ [item]: numericValue });
      }
    });
  }

  // ─── Boolean search ──────────────────────────────────────────
  if (isBooleanValue) {
    const boolValue = this.searchItem === "true";

    this.booleanFields?.forEach((item: string) => {
      if (item.includes(".")) {
        const parts = item.split(".");

        if (parts.length === 3) {
          const [relation, subRelation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const subUsesSome = !this.singleRelations.includes(subRelation as string);

          const innerValue = { [field as string]: boolValue };
          const subLevel = subUsesSome ? { some: innerValue } : innerValue;

          this.searchCondition.push({
            [relation as string]: relUsesSome
              ? { some: { [subRelation as string]: subLevel } }
              : { [subRelation as string]: subLevel },
          });

        } else if (parts.length === 2) {
          const [relation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const innerValue = { [field as string]: boolValue };

          this.searchCondition.push({
            [relation as string]: relUsesSome ? { some: innerValue } : innerValue,
          });
        }
      } else {
        this.searchCondition.push({ [item]: boolValue });
      }
    });
  }

  // ─── String search ───────────────────────────────────────────
  if (isNaN(numericValue) && !isBooleanValue) {
    this.stringSearchFields?.forEach((item: string) => {
      if (item.includes(".")) {
        const parts = item.split(".");

        if (parts.length === 3) {
          const [relation, subRelation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const subUsesSome = !this.singleRelations.includes(subRelation as string);

          const innerValue = { [field as string]: { contains: this.searchItem, mode: "insensitive" } };
          const subLevel = subUsesSome ? { some: innerValue } : innerValue;

          this.searchCondition.push({
            [relation as string]: relUsesSome
              ? { some: { [subRelation as string]: subLevel } }
              : { [subRelation as string]: subLevel },
          });

        } else if (parts.length === 2) {
          const [relation, field] = parts;
          const relUsesSome = !this.singleRelations.includes(relation as string);
          const innerValue = { [field as string]: { contains: this.searchItem, mode: "insensitive" } };

          this.searchCondition.push({
            [relation as string]: relUsesSome ? { some: innerValue } : innerValue,
          });
        }
      } else {
        this.searchCondition.push({
          [item]: { contains: this.searchItem, mode: "insensitive" },
        });
      }
    });
  }
}


  filter() {
    const excludedField = [
      "searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include",
    ];

    Object.keys(this.query).forEach((field) => {
      if (excludedField.includes(field)) return;
      const value = this.query[field];
      const parts = field.split(".");

      // ─── e.g. specialities.specialty.title ──────────────────────
      if (parts.length === 3) {
        const [relation, subRelation, actualField] = parts;
        const bracketMatch = actualField?.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;

        // innermost field value
        const fieldValue = this.buildFieldValue(actualField as string, value, bracketMatch);

        // subRelation: single নাকি array?
        const subUsesSome = !this.singleRelations.includes(subRelation as string);
        const subLevel = subUsesSome
          ? { some: fieldValue }          // appointments: { some: { status: "..." } }
          : fieldValue;                   // specialty: { title: "..." }

        // relation: single নাকি array?
        const relUsesSome = !this.singleRelations.includes(relation as string);
        this.filterCondition.push({
          [relation as string]: relUsesSome
            ? { some: { [subRelation as string]: subLevel } }   // specialities: { some: { specialty: {...} } }
            : { [subRelation as string]: subLevel },            // schedule: { appointments: {...} }
        });

      // ─── e.g. schedule.startDateTime ────────────────────────────
      } else if (parts.length === 2) {
        const [relation, actualField2] = parts;
        const bracketMatch = actualField2?.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;

        const fieldValue = this.buildFieldValue(actualField2 as string, value, bracketMatch);

        const relUsesSome = !this.singleRelations.includes(relation as string);
        this.filterCondition.push({
          [relation as string]: relUsesSome
            ? { some: fieldValue }   // appointments: { some: { status: "..." } }
            : fieldValue,            // schedule: { startDateTime: "..." }
        });

      // ─── e.g. isBooked, status ──────────────────────────────────
      } else if (!field.includes(".")) {
        const bracketMatch = field.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;

        if (bracketMatch) {
          const [, actualField, operator] = bracketMatch;
          this.filterCondition.push({
            [actualField as string]: {
              [operator as string]: this.parseValue(value),
            },
          });
        } else if (Array.isArray(value)) {
          this.filterCondition.push({
            [field]: { in: value.map((v) => this.parseValue(v)) },
          });
        } else {
          this.filterCondition.push({
            [field]: this.parseValue(value),
          });
        }
      }
    });
  }

  dynamicInclude() {
    if (this.query?.include) {
      const includeAllFields = this.query.include
        .split(",")
        .map((item: string) => item.trim());
      includeAllFields.forEach((item: string) => {
        const includeSubFields = item.split(".");
        if (includeSubFields.length === 2) {
          const [firstField, secondField] = includeSubFields;
          this.include = {
            ...this.include,
            [firstField as string]: { include: { [secondField as string]: true } },
          };
        } else {
          this.include = { ...this.include, [item as string]: true };
        }
      });
    }
  }

  callAll() {
    this.sort();
    if (this.searchItem) {
      this.search();
    }
    this.filter();
    this.dynamicInclude();
  }

  fetch = async () => {
    const delegate = (prisma as any)[this.model];

    if (!delegate || typeof delegate.findMany !== "function") {
      throw new AppError(
        status.BAD_REQUEST,
        `"${this.model as any}" নামে কোনো prisma model পাওয়া যায়নি`,
      );
    }

    const whereCondition = {
      ...(this.searchCondition.length > 0 && { OR: this.searchCondition }),
      ...(this.filterCondition.length > 0 && { AND: this.filterCondition }),
    };

    const data = await delegate.findMany({
      where: whereCondition,
      include: this.include,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    });

    const totalAmountOfData = await delegate.count({ where: whereCondition });

    const meta = {
      page: this.page,
      limit: this.take,
      total: totalAmountOfData,
      totalPages: Math.ceil(totalAmountOfData / this.take),
    };

    return { data, meta };
  };
}