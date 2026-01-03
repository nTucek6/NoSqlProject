export class CreditRiskClass {
  constructor(fields = []) {
    this.checkingAccountStatus = fields[0] || "unknown";
    this.durationMonths = parseInt(fields[1]) || 0;
    this.creditHistory = fields[2] || "unknown";
    this.purpose = fields[3] || "unknown";
    this.creditAmount = parseInt(fields[4]) || 0;
    this.savingsAccount = fields[5] || "unknown";
    this.employmentSince = fields[6] || "unknown";
    this.installmentRatePercent = parseInt(fields[7]) || 0;
    this.personalStatusSex = fields[8] || "unknown";
    this.otherDebtors = fields[9] || "unknown";
    this.residenceSince = parseInt(fields[10]) || 0;
    this.property = fields[11] || "unknown";
    this.ageYears = parseInt(fields[12]) || 0;
    this.otherInstallments = fields[13] || "unknown";
    this.housing = fields[14] || "unknown";
    this.existingCreditsThisBank = parseInt(fields[15]) || 0;
    this.job = fields[16] || "unknown";
    this.dependentsCount = parseInt(fields[17]) || 0;
    this.telephone = fields[18] || "unknown";
    this.foreignWorker = fields[19] || "unknown";
    this.targetClass = parseInt(fields[20]);
  }
}

export class StatisticsNumerical {
  variable;
  avarage;
  standard_Deviation;
  validCount;
  constructor() {}

  static parseToObject(object) {
     
  }
}
