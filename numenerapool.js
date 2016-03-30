function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var fr = {
    'might': 'Puissance',
    'speed': 'Célérité',
    'intellect': "Intellect"
}

var uk = {
    'might': 'Might',
    'speed': 'Speed',
    'intellect': "Intellect"
}

var numenerapool = {
    run: function() {
        this.mainDiv = document.getElementById('numenerapool');
        this.pools = {};
        var language = this.getLanguage();
        this.createPool('might', language);
        this.createPool('speed', language);
        this.createPool('intellect', language);
    },
    
    getLanguage: function() {
        var lang = getParameterByName('lang');
        
        var frenchFlag = document.getElementById('frImg');
        var englishFlag = document.getElementById('ukImg');
        
        if (!lang || lang !== 'fr') {
            englishFlag.style.opacity = 0.8;
            return uk;
        } else {
            frenchFlag.style.opacity = 0.8;
            return fr;    
        }
    },
    
    createPool: function(poolName, language) {
        var pool = new statPool();
        this.pools[poolName] = pool;
        pool.create(this.mainDiv, poolName, language[poolName]);
    }
};

function statPool() {
    this.create = function(div, css, name) {
        this.name = name;
        this.poolDiv = document.createElement('div');
        this.css = css;
        this.poolDiv.className = 'pool';
        div.appendChild(this.poolDiv);
        
        var storedStat = localStorage.getItem(this.css);
        if (!storedStat) {
            this.stat = 10;
        } else {
            this.stat = storedStat;
        }
        
        this.minusDiv = document.createElement('div');
        this.minusDiv.className = 'minus button';
        this.minusDiv.innerHTML = '-';
        
        
        this.statContainerDiv = document.createElement('div');
        this.statContainerDiv.className = 'statContainer ' + this.css;
        
        this.poolTitle = document.createElement('div');
        this.poolTitle.className = 'poolTitle';
        this.poolTitle.innerHTML = this.name;
        this.statContainerDiv.appendChild(this.poolTitle);
        
        this.statDiv = document.createElement('div');
        this.statDiv.className = 'stat';
        this.setStat();
        this.statContainerDiv.appendChild(this.statDiv);
        
        this.addDiv = document.createElement('div');
        this.addDiv.className = 'add button';
        this.addDiv.innerHTML = "+";
        
        this.poolDiv.appendChild(this.minusDiv);
        this.poolDiv.appendChild(this.statContainerDiv);
        this.poolDiv.appendChild(this.addDiv);
        
        var self = this;
        this.minusDiv.onclick = function() {
            self.stat--;
            self.setStat();
        };
        
        this.addDiv.onclick = function() {
            self.stat++;
            self.setStat();
        };
    };
    
    this.setStat = function() {
        this.statDiv.innerHTML = this.stat.toString();
        localStorage.setItem(this.css, this.stat);
    };
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

ready(function() {
    numenerapool.run();   
});