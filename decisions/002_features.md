# Features

I am going to break down as many of the features as I can here so that I can track them and also think more about them in a structured way.

## Metrics

The whole point of this project is content. So, the metrics that matter all relate to attention that is captured. They are listed from TOFU to BOFU.

- **Views**: There are two view counts I care about. Views on feed, and views on feed details. The views on Feed will be tracked in Fathom, but feed detail views will be tracked in DB.
  - This will allow me to pull aggregates that can be shown publicly or privately.
  - To make sure these are as unique as possible I will use user ids if visitor is logged in or an anonymous id stored in a cookie to manage view tracking.
- **Bookmarks**: This is when a user decides to save a post in their account. I want to be able to see how many times a post has been bookmarked.
  - What would also be dope is to track if a conversion came from a specific bookmark.
- **Conversion**: This is tracking how many conversions we have to user accounts and therefore the Newsletter. This is the goal for all of this. Drive account/newsletter signups.


Admin

Feed

Categories

Submissions
