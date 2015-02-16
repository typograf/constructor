(function() {

var App = {
    init: function() {
        document.querySelector('.rules').innerHTML = this._buildRules();
        this._updateSource([]);
        this._events();
    },
    _enabledByDefault: {},
    _buildRules: function() {
        var html = ['<tr><th class="rules__checkbox"><input type="checkbox" title="Toggle all" class="rules__select-all" autocomplete="off" /></th><th></th><th class="rules__name">Name</th><th class="rules__title">Title</th>'];
        Typograf.prototype._rules.sort(function(a, b) {
            return a.name > b.name ? 1 : -1;
        }).forEach(function(rule, i) {
            var title = Typograf.prototype.titles[rule.name],
                checked = rule.enabled === false ? false : true;

            this._enabledByDefault[rule.name] = checked;

            html.push('<tr' + (checked ? ' class="rules__checked"' : '') + '>' +
                '<td class="rules__checkbox"><input id="' + rule.name + '" type="checkbox" autocomplete="off" ' + (checked ? ' checked="checked" ' : '')+ '/></td>' +
                '<td class="rules__num">' + (i + 1) + '.</td>' +
                '<td class="rules__name">' + rule.name + '</td>' +
                '<td class="rules__title">' + (title.en || title.common) + '</td></tr>');
        }, this);

        return html.join('');
    },
    _events: function() {
        document
            .querySelector('.controls__select-all')
            .addEventListener('click', function() {

            }, false);

        document
            .querySelector('.controls__default')
            .addEventListener('click', function() {

            }, false);

        document
            .querySelector('.result__textarea')
            .addEventListener('click', function() {
                this.select();
            }, false);
    },
    _updateSource: function(rules) {
        document.querySelector('.result__textarea').value = this._getSource(rules);
    },
    _getSource: function(rules) {
        var text = 'var t = new Typograf();\n',
            enabled = [],
            pad = '\n    ';

        if(rules.length) {
            rules.sort().forEach(function(rule) {
                enable.push(rule.name);
            });

            text += 't.enable([' + pad + enable.join(',' + pad) + ']);';
        }

        return text;
    }
};

App.init();


})();