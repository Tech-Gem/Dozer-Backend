const cron = require("node-cron");
const {
  determineWinningBidder,
} = require("../controllers/bidder.controller.js"); // Assuming you have this function

// Define the scheduled task to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    // Your logic to check for ended bids and determine winners
    // Fetch all bids that have ended
    const endedBids = await Bidding.findAll({
      where: { endDate: { [Sequelize.Op.lt]: new Date() } },
    });

    // Process each ended bid
    for (const bid of endedBids) {
      // Determine the winning bidder
      const { winningBidder } = await determineWinningBidder(bid.id);

      // Update the winning bidder's status to "win" in the database
      if (winningBidder) {
        await Bidder.update(
          { winningStatus: "win" },
          { where: { id: winningBidder.id } }
        );
      }
      // Update status of all other bidders to "lose"
      await Bidder.update(
        { winningStatus: "lose" },
        {
          where: {
            biddingId: bid.id,
            id: { [Sequelize.Op.ne]: winningBidder.id },
          },
        }
      );
    }

    console.log("Updated winning bidders successfully.");
  } catch (error) {
    console.error("Error updating winning bidders:", error);
  }
});

// Start the cron job
cron.start();
