// Generated by CoffeeScript 1.3.3
(function() {
  var SiteCollection, SiteModel, Sites, builtInSites,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  builtInSites = {
    'google': {
      opts: {
        selectors: ['div#rso>div.bkWMgd h2.bNg8Rb ~ div div.rc div.r>a:not(.fl):nth(*)'],
        allowSubdomains: false,
        search_selector: 'input[title="Search"]',
        paginator_selector_next: 'a#pnnext.pn',
        paginator_selector_prev: 'a#pnprev.pn',
        liveUpdateElement: '#main'
      },
      regex: '^https?://(www\.)?google\.([a-z\.]+)\/(?!reader\/).*$'
    },
    'news.ycombinator': {
      opts: {
        selectors: ['td.title a:nth(*)'],
        search_selector: 'center form input'
      },
      regex: 'https?://news\.ycombinator\.com\/.*'
    },
    'quora': {
      opts: {
        selectors: ['div.pagedlist_item:not(.pagedlist_hidden) a.question_link:nth(*)'],
        search_selector: '.question_box.light',
        infiniteScroll: true,
        liveUpdateElement: '.main .e_col .w4_5 main_col'
      },
      regex: 'https?://(www\.)?quora\.com\/.*'
    },
    'reddit': {
      opts: {
        selectors: ['#siteTable div.entry:nth(*) a.title'],
        search_selector: 'form#search input',
        paginator_selector_next: 'p.nextprev a:last-of-type',
        paginator_selector_prev: 'p.nextprev a:first-of-type'
      },
      regex: 'https?://(www\.)?reddit\.com\/.*'
    },
    'amazon': {
      opts: {
        selectors: ['h3.newaps:nth(*)>a', 'div.data:nth(*) h3.title a.title'],
        search_selector: '#twotabsearchtextbox',
        paginator_selector_next: '#pagnNextLink',
        paginator_selector_prev: '#pagnPrevLink'
      },
      regex: 'https?://(www\.)?amazon\.[a-z\.]+\/.*'
    },
    'ebay': {
      opts: {
        selectors: ['div.ittl:nth(*) a', 'div.ttl:nth(*) a', 'div.ititle:nth(*) a.vip'],
        search_selector: '#_fsb_nkw',
        paginator_selector_next: 'td.botpg-next a',
        paginator_selector_prev: 'td.botpg-prev a'
      },
      regex: 'https?://(www\.)?ebay\.[a-z\.]+\/.*'
    },
    'yelp': {
      opts: {
        selectors: ['div.businessresult:nth(*) h4.itemheading a'],
        search_selector: '#find_desc',
        paginator_selector_next: '#pager_page_next',
        paginator_selector_prev: '#pager_page_prev',
        liveUpdateElement: '#businessresults'
      },
      regex: 'https?://(www\.)?yelp\.com\/.*'
    },
    'craigslist': {
      opts: {
        selectors: ['p.row:nth(*)>a'],
        search_selector: '#query',
        paginator_selector_next: 'h4>span:last-of-type>a',
        paginator_selector_prev: 'h4>span:first-of-type>a'
      },
      regex: 'https?:\/\/(.*\.|)craigslist.org/.*'
    },
    'linkedin': {
      opts: {
        selectors: ['li.vcard:nth(*)>div>h2>a'],
        search_selector: '#keywords-search',
        paginator_selector_next: '.paginator-next',
        paginator_selector_prev: '.paginator-prev'
      },
      regex: 'https?://([a-z]+\.)?linkedin\.com\/.*'
    },
    'facebook': {
      opts: {
        selectors: [['#pagelet_home_stream li.uiStreamStory', '#pagelet_home_stream li.uiStreamStory:nth(*) a:nth(1)']],
        search_selector: 'input#q.inputtext.DOMControl_placeholder',
        liveUpdateElement: '#contentArea',
        infiniteScroll: true
      },
      regex: 'https?://(www\.)?facebook\.com\/.*'
    },
    'youtube': {
      opts: {
        selectors: ['li div div h3 a:nth(*)'],
        search_selector: '#masthead-search-term'
      },
      regex: 'https?://(www\.)?youtube\.com\/.*'
    },
    'stackoverflow|serverfault|superuser|askubuntu|stackexchange': {
      opts: {
        selectors: ['div h3 a.question-hyperlink:nth(*)'],
        search_selector: 'form#search div input.textbox'
      },
      regex: 'https?://([a-z]+\.)?(stackoverflow|serverfault|superuser|askubuntu|stackexchange).com\/.*'
    },
    'techcrunch': {
      opts: {
        selectors: ['h2.headline a:nth(*)'],
        paginator_selector_next: '.page-next>a',
        paginator_selector_prev: '.page-prev>a'
      },
      regex: 'https?://(www\.)?techcrunch\.com\/.*'
    },
    'lobsters': {
      opts: {
        selectors: ['li span.link a:nth(*)']
      },
      regex: 'https?://lobste\.rs\/.*'
    }
  };

  SiteModel = (function(_super) {

    __extends(SiteModel, _super);

    function SiteModel() {
      return SiteModel.__super__.constructor.apply(this, arguments);
    }

    SiteModel.prototype.getOpts = function() {
      var json;
      return json = JSON.stringify(this.get('opts'), void 0, '    ');
    };

    SiteModel.prototype.submitToJK = function() {
      var json, method, url;
      if (this.get('onlineId')) {
        url = "http://http://jknavigator.herokuapp.com/api/v1/site/" + this.get('onlineId') + "/";
        method = "PUT";
      } else {
        url = "http://jknavigator.herokuapp.com/api/v1/site/";
        method = "POST";
      }
      json = _.pick(this.attributes, ['site', 'regex']);
      json['opts'] = this.attributes['opts'];
      return $.ajax({
        type: method,
        url: url,
        processData: false,
        data: JSON.stringify(json),
        contentType: 'application/json'
      });
    };

    return SiteModel;

  })(Backbone.Model);

  SiteCollection = (function(_super) {

    __extends(SiteCollection, _super);

    function SiteCollection() {
      return SiteCollection.__super__.constructor.apply(this, arguments);
    }

    SiteCollection.prototype.model = SiteModel;

    SiteCollection.prototype.localStorage = new Backbone.LocalStorage("JKSites");

    SiteCollection.prototype.addDefaults = function() {
      return _.each(builtInSites, function(value, key) {
        return Sites.create({
          site: key,
          opts: value['opts'],
          regex: value['regex'] ? value['regex'] : void 0,
          builtin: true
        });
      });
    };

    SiteCollection.prototype.getSiteByUrl = function(url) {
      var sites,
        _this = this;
      sites = this.filter(function(site) {
        var r, regex;
        regex = site.get('regex');
        if (!regex) {
          return false;
        }
        regex = new RegExp(regex, 'i');
        return r = regex.test(url);
      });
      if (sites.length > 1) {
        console.warn("More than one site matched. Defaulted to the first match", sites);
      }
      return sites[0];
    };

    return SiteCollection;

  })(Backbone.Collection);

  Sites = new SiteCollection();

  $(document).ready(function() {
    Sites.fetch();
    if (Sites.models.length === 0) {
      return Sites.addDefaults();
    }
  });

  window.Sites = Sites;

  window.SiteModel = SiteModel;

}).call(this);
