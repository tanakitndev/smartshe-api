module.exports = async () => {
    const WorkPermit = require('./models/WorkPermit');
    const Department = require('./models/Department');
    const Location = require('./models/Location');
    const User = require('./models/User');
    const WorkPermitDetail = require('./models/WorkPermitDetail');
    const WorkPermitDetailConfine = require('./models/WorkPermitDetailConfine');
    // const RightUser = require('./models/RightUser');

    Department.hasMany(WorkPermit, { as: 'WorkPermit', foreignKey: 'department_id' });
    WorkPermit.belongsTo(Department, { as: 'departments', foreignKey: 'department_id' });

    Department.hasMany(Location, { as: 'Location', foreignKey: 'department_id' });
    Location.belongsTo(Department, { as: 'departments', foreignKey: 'department_id' });

    WorkPermit.belongsTo(Location, { as: 'location', foreignKey: 'location_id' });

    User.hasMany(WorkPermit, { as: 'user', foreignKey: 'user_id' });
    WorkPermit.belongsTo(User, { as: 'user', foreignKey: 'user_id' })

    WorkPermitDetail.hasMany(WorkPermitDetailConfine, { as: 'work_permit_confines', foreignKey: 'work_permit_detail_id' });
}