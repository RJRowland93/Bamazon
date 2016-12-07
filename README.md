# Bamazon
Bamazon is a CLI market place that is built using Node.js and MySQL.
Set up the database by running the code from bamazonSchema.sql and bamazonSeeds.sql in MySQL.

## Bamazon Customer
to use the marketplace as a customer, type "node bamazonCustomer.js" in the command line to launch the app. The app retrieves the items for sale from the MySQL database. The user types in the ID of the item they would like to purchase and how many of the item they would like.

## Bamazon Manager
to use the marketplace as a manager type "node bamazonManager.js" in the command line to launch the app. This app allows the user to view all of the items for sale, view items with an inventory count of less than 5, add new items, and add more existing items. 
