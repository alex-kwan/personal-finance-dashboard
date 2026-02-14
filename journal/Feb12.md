On Feb 12 

- add additional pages ✅
- connect routes and screen interactions ✅
- persist UI interactions to the database and reflect updates back in the interface ✅
- build a new discussion on how we want to build out a cleaner architecture for visuals ✅
- start to build out a discussion on we can work with e2e and isolated testing ✅

working on:
- lib contains how we pull out different types of data from the database. Prisma is how we shape the data and retrieve/store it and SQLite is where we store it
- we have an api directory which stores the different routes mapped similar to how the pages are stored. This typically defines where we apply our PUTs and GETs which contains business logic as well on how we massage the data utilizing the underlying functions stored in the lib directory. We will typically error out at this stage to make sure we don't pass in bad data and put our database in an inconsistent state
- smoke tests to validate parts of the database. These are stored in the scripts directory

issues:

- pages are doing API requests to the database? what if the database is taking too long?