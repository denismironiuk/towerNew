export default function applyAssociations(models) {
    const {
      User,
      Certification,
      UserCertification,
      Tutorial,
      UserTutorial,
      AuditRecord,
      AuditSection,
      AuditQuestion,
      SWAReport,
    } = models;
  
    // 👥 Self-referencing: Manager & Subordinates
    User.hasMany(User, { foreignKey: "manager_number", as: "subordinates" });
    User.belongsTo(User, { foreignKey: "manager_number", as: "manager" });
  
    // 🏅 Certifications (Many-to-Many via UserCertification)
    User.belongsToMany(Certification, {
      through: UserCertification,
      foreignKey: "user_number",
      otherKey: "certification_id",
      as: "certifications",
    });
  
    Certification.belongsToMany(User, {
      through: UserCertification,
      foreignKey: "certification_id",
      otherKey: "user_number",
      as: "users",
    });
  
    // 📚 Tutorials (Many-to-Many via UserTutorial)
    User.belongsToMany(Tutorial, {
      through: UserTutorial,
      foreignKey: "employee_number",
      otherKey: "tutorial_id",
      as: "tutorials",
    });

    User.hasMany(UserCertification, {
      foreignKey: "user_number",
      as: "UserCertifications", // 👈 matches the alias you're using in include
    });
    UserCertification.belongsTo(User, {
      foreignKey: "user_number",
    });
    
  
    Tutorial.belongsToMany(User, {
      through: UserTutorial,
      foreignKey: "tutorial_id",
      otherKey: "employee_number",
      as: "users",
    });
  
    // 📝 Audit Records (One-to-Many)
    User.hasMany(AuditRecord, { foreignKey: "employee_number", as: "auditRecords" });
    AuditRecord.belongsTo(User, {
      foreignKey: "employee_number",
      targetKey: "employee_number",
      as: "employee",
      onDelete: "CASCADE",
    });
    AuditRecord.belongsTo(User, {
      foreignKey: "fab_manager_id",
      targetKey: "employee_number",
      as: "fabManager",
      onDelete: "CASCADE",
    });
  
    // 🧩 Audit Sections & Questions (One-to-Many)
    AuditSection.hasMany(AuditQuestion, { foreignKey: "section_id" });
    AuditQuestion.belongsTo(AuditSection, { foreignKey: "section_id" });
  
    // 🧾 SWA Reports
    SWAReport.belongsTo(AuditRecord, {
      foreignKey: "audit_record_id",
      onDelete: "CASCADE",
    });
    SWAReport.belongsTo(AuditSection, {
      foreignKey: "section_id",
      onDelete: "CASCADE",
    });
    SWAReport.belongsTo(AuditQuestion, {
      foreignKey: "question_id",
      onDelete: "SET NULL",
    });
    SWAReport.belongsTo(User, {
      foreignKey: "closed_by",
      targetKey: "employee_number",
      onDelete: "SET NULL",
    });

    UserTutorial.belongsTo(User, {
      foreignKey: "employee_number",
    });
    
    UserTutorial.belongsTo(Tutorial, {
      foreignKey: "tutorial_id",
    });

    UserCertification.belongsTo(User, {
      foreignKey: "user_number",
    });
    
    UserCertification.belongsTo(Certification, {
      foreignKey: "certification_id",
    });

    User.hasMany(UserTutorial, {
      foreignKey: "employee_number",
      as: "UserTutorials", // 👈 this is the alias you're using in the include
    });
    
  }
  