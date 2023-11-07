const path = require("path");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/usergroup");
const { Op } = require("sequelize");

exports.createGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;


    const invitedMembers = await User.findAll({
      where: {
        email: {
          [Op.or]: members,
        },
      },
    });

    (async () => {
      await Promise.all(
        invitedMembers.map(async (user) => {
          const response = await UserGroup.create({
            userId: user.dataValues.id,
            groupId: group.dataValues.id,
          });
        })
      );

      await UserGroup.create({
        userId: req.user.id,
        groupId: group.dataValues.id,
      });
    })();

    res.status(201).json({ group: group.dataValues.name, members: members });
  } catch (error) {
    console.log(error);
  }
};

exports.addToGroup = async (req, res, next) => {
  try {
    const groupName = req.body.groupName;
    const members = req.body.members;

    const group = await Group.findOne({ where: { name: groupName } });
    if (group) {
      if (admin.userId == req.user.id) {
        const invitedMembers = await User.findAll({
          where: {
            email: {
              [Op.or]: members,
            },
          },
        });
    }
}
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: UserGroup,
          where: { userId: req.user.id },
        },
      ],
    });
    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error);
  }
};

exports.groupMembers = async (req, res, next) => {
  try {
    const groupName = req.params.groupName;
    const group = await Group.findOne({ where: { name: groupName } });
    const userGroup = await UserGroup.findAll({
      where: { groupId: group.dataValues.id },
    });

    const users = [];

    await Promise.all(
      userGroup.map(async (user) => {
        const res = await User.findOne({
          where: { id: user.dataValues.userId },
        });
        users.push(res);
      })
    );
    res.status(200).json({ users: users });
  } catch (error) {
    console.log(error);
  }
}