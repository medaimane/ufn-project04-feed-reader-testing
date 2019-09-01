/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$((() => {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', () => {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', () => {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed - Done
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('each feed has a not empty url', () => {
            allFeeds.forEach(feed => {
                expect(feed).toBeDefined();
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBe('');
                expect(feed.url.startsWith('http://')).toBeTruthy();
            });
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('each feed has a not empty name', () => {
            allFeeds.forEach(feed => {
                expect(feed).toBeDefined();
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBe('');
            });
        });
    });


    // TODO: Write a new test suite named "The menu" - Done
    describe('The menu', () => {
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */

        // Arrange
        let bodyElement;
        beforeEach(() => {
            bodyElement = $('body');
        });

        it('is hidden by default', () => {
            // Assert
            expect(isMenuHidden(bodyElement)).toBeTruthy();
        });

        /* TODO: Write a test that ensures the menu changes - Done
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        describe('when the menu icon is clicked',  () => {
            // Arrange
            let menuIconLinkElement;
            beforeEach(() => {
                menuIconLinkElement = $('.menu-icon-link');
            });

            it('the menu should be displayed', async () => {
                // Act
                menuIconLinkElement.click();

                // Assert
                expect(isMenuHidden(bodyElement)).toBeFalsy();

                // teardown
                bodyElement.toggleClass('menu-hidden');
            });

            describe('when the menu is clicked again', () => {
                it('the menu should be hidden', () => {
                    // Act
                    menuIconLinkElement.click();
                    menuIconLinkElement.click();

                    // Assert
                    expect(isMenuHidden(bodyElement)).toBeTruthy();
                });
            })
        })
    });

    beforeAll(() => {
        /**
         * Avoid timeout error when calling the loadFeed function
         * by setting a custom DEFAULT_TIMEOUT_INTERVAL.
         */
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    // TODO: Write a new test suite named "Initial Entries" - Done
    describe('Initial Entries', () => {
        /* TODO: Write a test that ensures when the loadFeed - Done
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        let firstFeedIndex;
        beforeEach(async done => {
            firstFeedIndex = 0;
            await loadFeed(firstFeedIndex, done);
        });

        it('should be at least a single .entry element within the .feed container', () => {
            const entriesCollection = getFeedEntriesCollection($);

            // Assert
            expectEntriesContentExist(entriesCollection);
        });
    });

    // TODO: Write a new test suite named "New Feed Selection" - Done
    describe('New Feed Selection', () => {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */

        let firstFeedIndex;
        let secondFeedIndex;
        let oldEntriesCollection;
        let newEntriesCollection;

        beforeEach(async done => {
            firstFeedIndex = 0;
            secondFeedIndex = 1;

            await loadFeed(firstFeedIndex, async () => {
                // Select all .entry elements after the first load
                oldEntriesCollection = getFeedEntriesCollection($);
                // Second call of load feed
                await loadFeed(secondFeedIndex, () => {
                    // Select all .entry elements after the second load
                    newEntriesCollection = getFeedEntriesCollection($);
                    done();
                });
            });
        });

        it('should change the feed content', async () => {
            const firstItem = 0;

            expectEntriesContentExist(oldEntriesCollection);
            expectEntriesContentExist(newEntriesCollection);
            expect(getFeedEntryTextContent(
                newEntriesCollection[firstItem],
            )).not.toEqual(getFeedEntryTextContent(
                oldEntriesCollection[firstItem],
            ));

            // Also we could loop through the whole of the entries and see if the same content is there.
            // for (const newEntry of newEntriesCollection) {
            //     for(const oldEntry of oldEntriesCollection) {
            //         expect(newEntry.textContent).not.toBe(oldEntry.textContent);
            //     }
            // }
        });
    });

    const isMenuHidden = bodyElement => {
        return bodyElement.hasClass('menu-hidden');
    };

    const getFeedEntriesCollection = () => {
        return $('.feed').children();
    };

    const getFeedEntryTextContent = entryElement => {
        return entryElement.textContent;
    };

    const expectEntriesContentExist = entriesCollection => {
        expect(entriesCollection).toBeDefined();
        expect(entriesCollection.length).toBeGreaterThan(1);
    };
})());
