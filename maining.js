var allProjects = {
    counter: {
        i: 0,
        max: 0,
        n: 0
    },
    newElements: {},
    getByYear: {
        YEAR: {},
        urlStart: window.location.origin + '/wp-json/wp/v2/posts?_fields=id,title,content,modified,_links,excerpt&per_page=100&page=',
        urlPage: 1,
        url: window.location.origin + '/wp-json/wp/v2/posts?_fields=id,title,content,modified,_links,excerpt&per_page=100&page=1&orderby=date&order=asc',
        urlFinish: '&orderby=date&order=asc',
        jsonTake: [],
        jsonData: {}
    },
    httpR: '',
    sortedByYear: {},
    buildYearArray: function (itemsByYear) {
        allProjects.counter.i = 0;
        allProjects.counter.max = itemsByYear.length;
        for (allProjects.counter.i = 0; allProjects.counter.i < allProjects.counter.max; allProjects.counter.i++) {
            allProjects.getByYear.jsonTake.push(itemsByYear[allProjects.counter.i]);
        }
    },
    squareLink: function (son, papa, clName, text, dataSource) {
        this.newElements.son = document.createElement(son);
        this.newElements.papa = document.getElementsByClassName(papa)[0];
        this.newElements.papa.appendChild(this.newElements.son);
        this.newElements.son.setAttribute('class', clName);
        if (text) this.newElements.son.textContent = text;
        if (dataSource) this.newElements.son.setAttribute('data-source', dataSource);
    },
    showFullData: function () {
        document.getElementsByTagName('body')[0].appendChild(document.createElement("div")).setAttribute('class', 'year');
        // console.log(allProjects.getByYear.jsonTake);
        for (allProjects.counter.n = 0; allProjects.counter.n < allProjects.getByYear.jsonTake.length; allProjects.counter.n++) {
            if (allProjects.getByYear.jsonTake[allProjects.counter.n]._links["wp:featuredmedia"]) {
                console.log(allProjects.getByYear.jsonTake[allProjects.counter.n]._links["wp:featuredmedia"][0].href);
            } else {
                console.log('undef');
            }
            this.year = allProjects.getByYear.jsonTake[allProjects.counter.n].modified.split('-')[0];
            if (!allProjects.getByYear.YEAR[this.year]) {
                allProjects.getByYear.YEAR[this.year] = this.year;
                console.log(allProjects.getByYear.YEAR[this.year]);
                allProjects.squareLink('div', 'year', 'head', this.year, '');
            }
            allProjects.getByYear.jsonTake[allProjects.counter.n]._links["wp:featuredmedia"]? allProjects.linksData = allProjects.getByYear.jsonTake[allProjects.counter.n]._links["wp:featuredmedia"][0].href:'undefined';
            allProjects.squareLink('div', 'year', 'link', '', allProjects.linksData);
        }
    },
    makeRequest: function () {
        allProjects.httpR = new XMLHttpRequest();
        if (!allProjects.httpR) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }
        allProjects.httpR.onreadystatechange = allProjects.alertContents;
        allProjects.httpR.open('GET', allProjects.getByYear.url);
        allProjects.httpR.send();
    },
    alertContents: function () {
        if (allProjects.httpR.readyState === XMLHttpRequest.DONE) {
            if (allProjects.httpR.status === 200) {
                allProjects.getByYear.jsonData = JSON.parse(allProjects.httpR.responseText);
                allProjects.getByYear.urlPage = allProjects.getByYear.urlPage + 1;
                allProjects.getByYear.url = allProjects.getByYear.urlStart + allProjects.getByYear.urlPage + allProjects.getByYear.urlFinish;
                allProjects.makeRequest();
                allProjects.buildYearArray(allProjects.getByYear.jsonData);
            } else {
                allProjects.showFullData();
                console.log('There was a problem with the request.');
            }
        }
    }
}

window.addEventListener('load', allProjects.makeRequest);
