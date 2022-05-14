const User = require('@models/user');

async function disconnectGoogle (user) {
  if (!user || !user.google) return;
  await User.findOneAndUpdate({ _id: user._id }, { $unset: { google: 1 }, $inc: { connectedSocialAccounts: -1} });
}

async function disconnectAmazon (user) {
  if (!user || !user.amazon) return user;
  const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $unset: { amazon: 1 }, $inc: { connectedSocialAccounts: -1} });
  return updatedUser;
}

async function disconnectGithub (user) {
  if (!user || !user.github) return user;
  const updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $unset: { github: 1 }, $inc: { connectedSocialAccounts: -1} });
  return updatedUser;
}

module.exports = {
  disconnectGoogle,
  disconnectAmazon,
  disconnectGithub,
};