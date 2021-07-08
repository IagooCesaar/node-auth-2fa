interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  compareInDays(start_date: Date, end_date: Date): number;

  convertToUTC(date: Date): string;
  dateNow();

  addDays(days: number, reference_date: Date): Date;
  addHours(hours: number, reference_date: Date): Date;

  checkIsBefore(start_date: Date, end_date: Date): boolean;
}

export { IDateProvider };
