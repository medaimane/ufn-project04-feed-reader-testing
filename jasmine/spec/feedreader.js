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
    describe('RSS Feeds', () => {
        it('are defined', () => {
            // Assert
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        it('each feed has a not empty url', () => {
            // Assert
            allFeeds.forEach(feed => {
                expect(feed).toBeDefined();
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBe('');
                expect(feed.url.startsWith('http://')).toBeTruthy();
            });
        });

        it('each feed has a not empty name', () => {
            // Assert
            allFeeds.forEach(feed => {
                expect(feed).toBeDefined();
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBe('');
            });
        });
    });

    describe('The menu', () => {
        let bodyElement;

        beforeEach(() => {
            bodyElement = $('body');
        });

        it('is hidden by default', () => {
            // Assert
            expect(isMenuHidden(bodyElement)).toBeTruthy();
        });

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

    describe('Initial Entries', () => {
        let firstFeedIndex;
        
        beforeEach(async done => {
            firstFeedIndex = 0;
            await loadFeed(firstFeedIndex, done);
        });

        it('should be at least a single .entry element within the .feed container', () => {
            // Arrange
            const entriesCollection = getFeedEntriesCollection();

            // Assert
            expectEntriesContentExist(entriesCollection);
        });
    });

    describe('New Feed Selection', () => {
        let firstFeedIndex;
        let secondFeedIndex;
        let oldEntriesCollection;
        let newEntriesCollection;

        beforeEach(async done => {
            firstFeedIndex = 0;
            secondFeedIndex = 1;

            await loadFeed(firstFeedIndex, async () => {
                // Select all .entry elements after the first load
                oldEntriesCollection = getFeedEntriesCollection();
                // Second call of load feed
                await loadFeed(secondFeedIndex, () => {
                    // Select all .entry elements after the second load
                    newEntriesCollection = getFeedEntriesCollection();
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

    // utils functions
    const isMenuHidden = bodyElement => {
        return bodyElement.hasClass('menu-hidden');
    };

    const getFeedEntriesCollection = () => {
        return $('.feed .entry');
    };

    const getFeedEntryTextContent = entryElement => {
        return entryElement.textContent;
    };

    const expectEntriesContentExist = entriesCollection => {
        expect(entriesCollection).toBeDefined();
        expect(entriesCollection.length).toBeGreaterThan(1);
    };
})());
