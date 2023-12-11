const handleValidationError = (res, error) => {
  console.error(error);
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: error?.errors?.map((e) => e.message) });
  }
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeDatabaseError" ||
    error.name === "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({ error: error?.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = {
  handleValidationError,
};
