exports.userToDTO = (user) => ({
    username: user.username,
    no_wa: user.no_wa,
    role: user.role,
    isVerified: user.isVerified,
    kategori: user.kategori?.nama || null,
});

exports.userListToDTO = (list) => list.map(exports.userToDTO);
