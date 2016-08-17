export default _ => ({ // eslint-disable-line

  // link file UUID
  id: '',

  // canonical URL of the published page
  // https://ig.ft.com/sites/pensions-interestrates get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/pensions-interestrates',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Interest rates and pension deficits',

  summary: 'Explainer: How decreasing interest rates affects pension deficits',

  topic: {
    name: 'Starter Kit',
    url: '/foo',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Joanna S Kao', url: 'https://twitter.com/joannaskao' },
    { name: 'John Authers', url: 'https://twitter.com/johnauthers'},
  ],

  // Appears in the HTML <title>
  title: '',

  // meta data
  description: '',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  // optional social meta data
  // twitterCreator: '@individual's_account',
  // tweetText:  '',
  // socialHeadline: '',
  // socialSummary:  '',

  onwardjourney: {

    // list (methode list) or topic
    type: '',

    // topic or list id
    id: '',

    // a heading is provided automatically if not set (peferred)
    heading: '',
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
