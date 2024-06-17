const seedBidSpaces = async () => {
  try {
   
    // Fetch all users
    const users = await UserProfile.findAll();

    if (users.length === 0) {
      console.log(
        "No users found in the database. Please create some users first."
      );
      return;
    }

    const bidSpacesData = [];

    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const roomId = uuidv4();

      const newBid = {
        id: uuidv4(),
        userName: `${user.firstName} ${user.lastName}`,
        roomId,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        priceMin: faker.commerce.price(10, 50, 2),
        priceMax: faker.commerce.price(51, 100, 2),
        status: "Open",
        isHost: true,
        participants: [user.id],
        userId: user.id,
      };

      bidSpacesData.push(newBid);
    }

    await BidSpace.bulkCreate(bidSpacesData);
    console.log("BidSpaces have been successfully seeded.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};
