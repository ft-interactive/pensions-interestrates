export default _ => ({ // eslint-disable-line

  // link file UUID
  id: '3e17efac-68bd-11e6-ae5b-a7cc5dd5a28c',

  // canonical URL of the published page
  // https://ig.ft.com/sites/pensions-interestrates get filled in by the ./configure script
  url: 'https://ig.ft.com/sites/pensions-interestrates-explainer/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2016-08-23T17:11:22Z'),

  headline: 'Pensions and bonds: the problem explained',

  summary: 'Bond mathematics and the scale of pension deficits',

  topic: {
    name: 'Capital Markets',
    url: 'http://www.ft.com/markets/capital-markets',
  },

  // relatedArticle: {
  //   text: 'Related article »',
  //   url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  // },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Joanna S Kao', url: 'https://twitter.com/joannaskao' },
    { name: 'John Authers', url: 'https://twitter.com/johnauthers' },
  ],

  // Appears in the HTML <title>
  title: 'Pensions and bonds: the problem explained',

  // meta data
  description: 'Bond mathematics and the scale of pension deficits',
  image: 'https://ig.ft.com/sites/pensions-interestrates-explainer/images/social.jpg',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  // optional social meta data
  // twitterCreator: '@individual's_account',
  socialHeadline:  'Pensions\' painful arithmetic',
  socialSummary:  'Bond mathematics and the scale of pension deficits explained',

  onwardjourney: {

    // list (methode list) or topic
    type: '',

    // topic or list id
    id: 'thing/ODNiNDVlNTEtMTYwMy00YjMzLTkxM2ItZDkzNmJmODgzNzA3-VG9waWNz',

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
