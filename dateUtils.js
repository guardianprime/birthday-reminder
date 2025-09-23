class DateUtils {
  static getTodayMMDD() {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
  }

  static getBirthdayMMDD(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return null;

    return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  }

  static isBirthdayToday(birthdayDate) {
    const today = DateUtils.getTodayMMDD();
    const birthday = DateUtils.getBirthdayMMDD(birthdayDate);
    return birthday === today;
  }

  static getUpcomingBirthdays(birthdays, days = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return birthdays.filter((birthday) => {
      const birthDate = new Date(birthday.date);
      const thisYear = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

      return thisYear >= today && thisYear <= futureDate;
    });
  }
}

module.exports = DateUtils;
