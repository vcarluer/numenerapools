/*global localStorage*/
/*global navigator*/

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
    'intellect': "Intellect",
    'npc': "PNJ",
    'delete': '<i class="fa fa-trash-o"></i>',
    'clone': '<i class="fa fa-clone"></i>',
    'playerMode': 'Joueur',
    'gmMode': 'MJ'
}

var uk = {
    'might': 'Might',
    'speed': 'Speed',
    'intellect': "Intellect",
    'npc': "NPC",
    'delete': '<i class="fa fa-trash-o"></i>',
    'clone': '<i class="fa fa-clone"></i>',
    'playerMode': 'Player',
    'gmMode': 'GM'
}

var numenerapool = {
    run: function() {
        this.mainDiv = document.getElementById('numenerapool');
        var language = this.getLanguage();
        this.createModes(language);
        this.createPlayerStats(language);
        this.createGMStats(language)
        this.createActionBar();
    },
    
    createActionBar: function() {
        this.actionBar = document.createElement('div');
        this.actionBar.className = 'actionBar';
        this.mainDiv.appendChild(this.actionBar);
    },
    
    createModes: function(language) {
        var modeDiv = document.createElement('div');
        modeDiv.className = 'appMode';
        this.mainDiv.appendChild(modeDiv);
        
        var playerMode = document.createElement('div');
        playerMode.className = 'mode selectedMode';
        playerMode.innerHTML = language['playerMode'];
        var self = this;
        
        modeDiv.appendChild(playerMode);
        
        var gmMode = document.createElement('div');
        gmMode.className = 'mode';
        gmMode.innerHTML = language['gmMode'];
        
        modeDiv.appendChild(gmMode);
        
        
        playerMode.onclick = function() {
            var gmDiv = document.getElementById('gmDiv');
            var playerDiv = document.getElementById('playerDiv');
        
            self.unselect();
            if (self.selectedVignette) {
                self.selectedVignette.className = 'poolVignette';
                self.selectedVignette = null;
            }
            
            gmDiv.style.display = 'none';
            gmMode.className = "mode";
            playerDiv.style.display = 'table';    
            playerMode.className = "mode selectedMode";
        };
        
        gmMode.onclick = function() {
            var gmDiv = document.getElementById('gmDiv');
            var playerDiv = document.getElementById('playerDiv');
        
            gmDiv.style.display = 'block';
            gmMode.className = "mode selectedMode";
            playerDiv.style.display = 'none';    
            playerMode.className = "mode";
        };
    },
    
    createPlayerStats: function(language) {
        var playerDiv = document.createElement('div');
        playerDiv.setAttribute('id', 'playerDiv');
        playerDiv.className = 'tableDiv';
        this.mainDiv.appendChild(playerDiv);
        
        var storedPools = localStorage.getItem('playerPoolStats');
        if (storedPools) {
            this.playerPoolStats = JSON.parse(storedPools);
            var key, params;
            for(key in this.playerPoolStats) {
                if (this.playerPoolStats.hasOwnProperty(key)) {
                    params = this.playerPoolStats[key];
                    this.createPlayerPool(playerDiv, params);
                }
            }
        } else {
            var might = { name: 'might', caption: language['might'], stat: 10 };
            var speed = { name: 'speed', caption: language['speed'], stat: 10 };
            var intellect = { name: 'intellect', caption: language['intellect'], stat: 10 };
            
            this.createPlayerPool(playerDiv, might);
            this.createPlayerPool(playerDiv, speed);
            this.createPlayerPool(playerDiv, intellect);    
        }
    },
    
     createGMStats: function(language) {
        var gmDiv = document.createElement('div');
        gmDiv.setAttribute('id', 'gmDiv');
        gmDiv.className = 'gmDiv';
        this.mainDiv.appendChild(gmDiv);
        
        var storedPools = localStorage.getItem('gmPoolStats');
        if (storedPools) {
            this.gmPoolStats = JSON.parse(storedPools);
            var key, params;
            for(key in this.gmPoolStats) {
                if (this.gmPoolStats.hasOwnProperty(key)) {
                    params = this.gmPoolStats[key];
                    this.createGMPool(language, gmDiv, params);
                }
            }
        }
        
        this.createGMAdd(gmDiv, language);
    },
    
    getLanguage: function() {
        var lang = getParameterByName('lang');
        if (!lang) lang = navigator.language;
        
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
    
    gmPoolStats: {},
    playerPoolStats: {},
    
    createGMPool: function(language, div, params) {
        var poolVignette = document.createElement('div');
        var vignetteId = params.name + '-vignette';
        poolVignette.setAttribute('id', vignetteId);
        poolVignette.className = 'poolVignette';
        var self = this;
        poolVignette.onclick = function() {
            if (self.selectedVignette) {
                if (self.selectedVignette.getAttribute('id') === poolVignette.getAttribute('id')) {
                    return;
                } else {
                    self.selectedVignette.className = 'poolVignette'
                }
            }
            
            self.selectedVignette = poolVignette;
            poolVignette.className = 'poolVignette selectedVignette';
            if (!self.deleteDiv) {
                self.deleteDiv = document.createElement('div');
                self.deleteDiv.innerHTML = language['delete'];
                self.deleteDiv.className = 'action';
                self.actionBar.appendChild(self.deleteDiv);
            }
            
            
            self.deleteDiv.onclick = function() {
                self.unselect();
                div.removeChild(poolVignette);
                self.selectedVignette = null;
                if (self.gmPoolStats[params.name]) {
                    delete self.gmPoolStats[params.name];
                }
                
                self.storeGMStats();
                
                var key, nextParams;
                for(key in self.gmPoolStats) {
                    if (self.gmPoolStats.hasOwnProperty(key)) {
                        nextParams = self.gmPoolStats[key];
                        if (nextParams.name > params.name) {
                            var nextVignette = document.getElementById(nextParams.name + '-vignette');
                            if (nextVignette) {
                                nextVignette.click();
                                break;
                            }
                        }
                    }
                }
            }
            
            if (!self.cloneDiv) {
                self.cloneDiv = document.createElement('div');
                self.cloneDiv.innerHTML = language['clone'];
                self.cloneDiv.className = 'action cloneVignette';
                self.actionBar.appendChild(self.cloneDiv);
            }
            
            self.cloneDiv.onclick = function() {
                self.addNewVignette(div, language, self.gmPoolStats[params.name]);
            }
        }
        
        div.appendChild(poolVignette);
        var tableDiv = document.createElement('div');
        tableDiv.className = 'tableDiv';
        poolVignette.appendChild(tableDiv);
        this.createPool(tableDiv, params, function() { self.storeGMStats(); });
        this.gmPoolStats[params.name] = params;
    },
    
    unselect: function() {
        if (this.deleteDiv) {
            this.actionBar.removeChild(this.deleteDiv);    
        }
        
        if (this.cloneDiv) {
            this.actionBar.removeChild(this.cloneDiv);    
        }
        
        this.deleteDiv = null;
        this.cloneDiv = null;
    },
    
    createPlayerPool: function(div, params) {
        var self = this;
        this.createPool(div, params, function() { self.storePlayerStats(); });
        this.playerPoolStats[params.name] = params
    },
    
    createPool: function(tableDiv, params, saveCallback) {
        var pool = new statPool();
        pool.create(tableDiv, params, saveCallback);
    },
    
    createGMAdd: function(gmDiv, language) {
        this.addVignette = document.createElement('div');
        this.addVignette.className = 'addVignette';
        this.addVignette.innerHTML = '+';    
        var self = this;
        this.addVignette.onclick = function() {
            self.addNewVignette(gmDiv, language);      
        };
    
        gmDiv.appendChild(this.addVignette);
    },
    
    addNewVignette: function(gmDiv, language, copyParams) {
        gmDiv.removeChild(this.addVignette);
        // Search next available id
        var storedIndex = localStorage.getItem('vignetteIndex');
        var index = 1;
        if (storedIndex) {
            index = storedIndex;
            index++;
        } 
        
        localStorage.setItem('vignetteIndex', index);
        
        var count = index + 1;
        
        var vignetteName = (count).toString();
        var params = {};
        if (copyParams) {
            params = {
                name: vignetteName,
                caption: copyParams.caption,
                stat: copyParams.stat
            };
        } else {
            var captionIndex = Math.floor(Math.random() * names.length);
            var vignetteCaption = names[captionIndex];
            
            params = {
                name: vignetteName,
                caption: vignetteCaption,
                stat: 10
            };
        }
        
        this.gmPoolStats[vignetteName] = params;
        
        this.storeGMStats();
        
        this.createGMPool(language, gmDiv, params);
        gmDiv.appendChild(this.addVignette);
    },
    
    storeGMStats: function() {
        localStorage.setItem('gmPoolStats', JSON.stringify(this.gmPoolStats));
    },
    
    storePlayerStats: function() {
        localStorage.setItem('playerPoolStats', JSON.stringify(this.playerPoolStats));
    }
};

function statPool() {
    this.create = function(tableDiv, params, saveCallback) {
        this.caption = params.caption;
        this.poolDiv = document.createElement('div');
        this.poolDiv.setAttribute('id', params.name);
        this.name = params.name;
        this.poolDiv.className = 'pool';
        tableDiv.appendChild(this.poolDiv);
        
        this.minusDiv = document.createElement('div');
        this.minusDiv.className = 'minus button noselect';
        this.minusDiv.innerHTML = '-';
        
        
        this.statContainerDiv = document.createElement('div');
        this.statContainerDiv.className = 'statContainer';
        
        this.poolTitle = document.createElement('div');
        this.poolTitle.className = 'poolTitle';
        this.poolTitle.innerHTML = this.caption;
        this.statContainerDiv.appendChild(this.poolTitle);
        
        this.statDiv = document.createElement('div');
        this.statDiv.className = 'stat';
        this.setStat(params.stat);
        this.statContainerDiv.appendChild(this.statDiv);
        
        this.addDiv = document.createElement('div');
        this.addDiv.className = 'add button noselect';
        this.addDiv.innerHTML = "+";
        
        this.poolDiv.appendChild(this.minusDiv);
        this.poolDiv.appendChild(this.statContainerDiv);
        this.poolDiv.appendChild(this.addDiv);
        
        var self = this;
        this.minusDiv.onclick = function() {
            params.stat--;
            self.setStat(params.stat, saveCallback);
        };
        
        this.addDiv.onclick = function() {
            params.stat++;
            self.setStat(params.stat, saveCallback);
        };
    };
    
    this.setStat = function(stat, saveCallback) {
        this.statDiv.innerHTML =stat.toString();
        if (saveCallback) {
            saveCallback();    
        }
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

var names = ["McSwin",
"Aaro",
"Boegler",
"Evitter",
"Chik",
"Pickok",
"Jörn",
"Escala",
"Kell",
"Ohmer",
"Amien",
"Glack",
"Nigere",
"Limerf",
"Vital",
"Chapicus",
"Emboz",
"Pickok",
"Chip",
"Lehtikal",
"Venâncis",
"Boschnig",
"Coe",
"Konson",
"Vierty",
"Akil Albergus",
"Chanin-Pricell",
"Jali",
"Jacob Coe",
"Denig",
"Hundt",
"Coser",
"Chapicus",
"Boardo",
"Jws Wnor",
"Amal",
"Akiral Leton",
"Avi Zachair",
"Barrader",
"Archison",
"Storch",
"Benex",
"Pickart",
"Kreundt",
"Phebaske",
"Rowe",
"Violen-Fran",
"Letickows",
"Peace",
"Pickland",
"Akill",
"Vitan",
"Jale",
"Ack",
"Brown",
"Zachecki",
"Jörn",
"Misner",
"Jare",
"Lloys",
"Gaffne",
"Badrote",
"Akillina",
"Aaro",
"Chik",
"Alcyr",
"Stri",
"Boman",
"McMora",
"Embergus",
"Veight",
"Ungeron",
"Lofton-Cook",
"Pheye",
"Dewalch"];