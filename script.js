// note: key library was modified to enable capture in addEventListener

(function() {

    var opts = {
        'google': {
            selectors: ['h3.r>a:nth(*)'],
            allowSubdomains: false,
            search_selector: '#gbqfq',
            paginator_selector_next: 'a#pnnext.pn',
            paginator_selector_prev: 'a#pnprev.pn',
            liveUpdateElement: '#main'
        },

        'news.ycombinator': {
            selectors: ['td.title a:nth(*)'],
            search_selector: 'center form input'
        },
        'quora': {
            selectors: ['div.pagedlist_item:not(.pagedlist_hidden) a.question_link:nth(*)'],
            search_selector: '.question_box.light'
        },
        'reddit': {
            selectors: ['#siteTable div.entry:nth(*) a.title'],
            search_selector: 'form#search input',
            paginator_selector_next: 'p.nextprev a:last-of-type',
            paginator_selector_prev: 'p.nextprev a:first-of-type'
        },
        'amazon': {
            selectors: ['h3.newaps:nth(*)>a', 'div.data:nth(*) h3.title a.title'],
            search_selector: '#twotabsearchtextbox',
            paginator_selector_next: '#pagnNextLink',
            paginator_selector_prev: '#pagnPrevLink'
        },
        'ebay': {
            selectors: ['div.ittl:nth(*) a', 'div.ttl:nth(*) a', 'div.ititle:nth(*) a.vip'],
            search_selector: '#_fsb_nkw',
            paginator_selector_next: 'td.botpg-next a',
            paginator_selector_prev: 'td.botpg-prev a'

        },
        'yelp': {
            selectors: ['div.businessresult:nth(*) h4.itemheading a'],
            search_selector: '#find_desc',
            paginator_selector_next: '#pager_page_next',
            paginator_selector_prev: '#pager_page_prev'
        },
        'craigslist': {
            selectors: ['p.row:nth(*)>a'],
            search_selector: '#query',
            paginator_selector_next: 'h4>span:last-of-type>a',
            paginator_selector_prev: 'h4>span:first-of-type>a'
        },
        'linkedin': {
            selectors: ['li.vcard:nth(*)>div>h2>a'],
            search_selector: '#keywords-search',
            paginator_selector_next: '.paginator-next'
        },
        'facebook': {
            selectors: [['li.uiStreamStory', 'li.uiStreamStory:nth(*) a:nth(1)']],
            search_selector: 'input#q.inputtext.DOMControl_placeholder',
            liveUpdateElement: '#contentArea'
        }
    }

    var group_selector_all = null;
    var group_selector = null;
    var site_opts = null;
    var site = null;

    function set_domain_opts(domain) {
        var parts = domain.split('.');
        var copy = parts.splice();

        if (parts[0] == 'www') {
            parts = parts.splice(1);
        }
        if (parts.length > 2 && parts[parts.length-2].length <= 3)
            parts.splice(-2);
        else
            parts.splice(-1);

        var i = 0;
        while (parts.length > 0) {
            main_domain = parts.join('.');
            if (opts[main_domain] && (i == 0 || opts[main_domain].allowSubdomains !== false))
            {
                site = main_domain;
                site_opts = opts[main_domain];
                return;
            }
            parts = parts.splice(1);
            i++;
        }
    }

    set_domain_opts(document.domain);
    
    function active_selector(idx) {
        return group_selector.replace(':nth(*)', ':nth('+idx+')')
    }

    if (!localStorage.idx)
        localStorage.idx = 0;

    var previousSelection = null;
    var select = function(focus) {
        if (previousSelection) {
            $(previousSelection).css('background-color', 'inherit');
        }
        var link = $(active_selector(localStorage.idx));
        link.css('background-color', '#fcc');
        if (focus) { link.focus(); }
        previousSelection = link.get()[0];
        return link;
    };

    var node = null;


    function start(focusResult) {
        $(site_opts.selectors).each(function(n, selector) {
            if (selector instanceof Array) {
                group_selector_all = selector[0];
                group_selector = selector[1];
            } else {
                group_selector_all = selector.replace(':nth(*)', '');
                group_selector = selector;
            }

            var result_links_container = $(group_selector_all);
            if (result_links_container.length) {
                //store the links into the local storage
                result_links = []
                result_links_container.each(function(m, link) {
                    result_links.push($(link).attr('href'));
                });
                new_result_links = JSON.stringify(result_links);
                if (localStorage.result_links != new_result_links)
                {
                    if (focusResult) { localStorage.idx = 0; }
                    localStorage.result_links = new_result_links;
                }
                localStorage.start_page = location.href;
                if (localStorage.idx == -1) {
                    localStorage.idx = result_links.length-1;
                }
                return false; // break
            } else {
                group_selector = group_selector_all = null;
            }
        });
        if (!group_selector)
            return;
        var newNode = $(active_selector(localStorage.idx));
        if (!node || (node.attr('href') != newNode.attr('href'))) {
            if (!localStorage.idx) {
                localStorage.idx = 0;
                select(focusResult);
                node = newNode;
            }
            else {
                select(focusResult);
                node = newNode;
            }
        }
        
    }

    var lock = false;

    $(function() {
        if (!site_opts) return;
        start(true);
        if (site_opts.liveUpdateElement) {
            var main = $(site_opts.liveUpdateElement).get()[0];
            if (main) {
                main.addEventListener("DOMSubtreeModified", function () {
                    if (!lock) {
                        lock = true;
                        start(false);
                        setTimeout(function() { lock = false; }, 0);
                    }
                });
            }
        }
    });

    //define what the different keystrokes do
    if (site_opts)
    {
        key('j', function(ev) {
            if (group_selector) {
                if (localStorage.idx < $(group_selector_all).length-1) {
                    localStorage.idx++;
                    select(true);
                }
                else {
                    if (site_opts.paginator_selector_next && $(site_opts.paginator_selector_next).length) {
                        localStorage.idx = 0; 
                        location.href = $(site_opts.paginator_selector_next).attr('href');
                    }
                }
                ev.stopPropagation();
            }
            else { 
                result_links = JSON.parse(localStorage.result_links);
		        if (link = result_links[++localStorage.idx]) {
		            location.href = link;		
		        }
		        else {
                   localStorage.idx--;
		        }

            }
        });
        key('k', function(ev) {
            if (group_selector) {
                if (localStorage.idx > 0) {
                    localStorage.idx--;
                    select(true);
                }
                else {
                    if (site_opts.paginator_selector_prev && $(site_opts.paginator_selector_prev).length && $(site_opts.paginator_selector_prev).attr('href') != 'javascript:;') {
                        localStorage.idx = -1; 
                        location.href = $(site_opts.paginator_selector_prev).attr('href');
                    }
                     
                }
                ev.stopPropagation();
            }
            else {
                result_links = JSON.parse(localStorage.result_links);
		            if (link = result_links[--localStorage.idx]) {
		                location.href = link;		
		            }
		            else {
                   localStorage.idx++;
		            }
            }
        });
        key('/', function(ev) {
            if (site_opts.search_selector)
                $(site_opts.search_selector).focus();
            ev.stopPropagation();
            ev.preventDefault();
        });
        function open_link(ev, newWindow, force) {
            var link = select();

            // If no particular element is focused, open the selected link.
            // Else, use the browser implementation to open the focused link
            // which already does the right thing.
            if (force || ev.target == document.body) {
                if (newWindow) {
                    window.open(link.attr('href'));
                } else {
                    location.href = link.attr('href');
                }
                ev.stopPropagation();
                ev.preventDefault();
            }
        }

        key('return', function(ev) {
            open_link(ev, false);
        });
    
        key('⌘+return', function(ev) {
            open_link(ev, true);
        });

        key('o', function(ev) {
            open_link(ev, false, true);
        });

        key('i', function(ev) {
            if (group_selector) {
                if (localStorage.idx > 0) {
                    localStorage.idx=0;
                    select(true);
                }
                ev.stopPropagation();
            }
            else {
                location.href = localStorage.start_page;
            }
        });
    }

})();
