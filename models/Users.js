module.exports = (sequelize, DataTypes)=>{
    const Users = sequelize.define("Users", {
        //id: {
        //    type: DataTypes.STRING,
        //    allowNull:false,
        //    primaryKey: true
        //},
        username: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        },
        e_mail: {
            type: DataTypes.STRING,
            allowNull:false
        },
        last_login_time: {
            type: DataTypes.DATE,
            allowNull:true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'blocked'],
            defaultValue: 'active'
        },
      // timestamps: true,
       
    }, 
    {
     timestamps: true,
        createdAt: 'registration_time',
        updatedAt: false,}
    )

   return Users;
};