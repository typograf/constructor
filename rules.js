(function() {

var defaultEnabled = {};

Typograf.prototype._rules.forEach(function(rule) {
    defaultEnabled[rule.name] = rule.enabled !== false;
});

var App = {
    init: function() {
        document.querySelector('.rules').innerHTML = this._buildRules();

        this._selectAll = document.querySelector('.rules__select-all');
        this._checkboxes = document.querySelectorAll('.rules__checkbox');

        this._events();

        this._updateSource();
    },
    _enabledByDefault: {},
    _buildRules: function() {
        var html = ['<tr><th class="rules__control"><input type="checkbox" title="Toggle all" class="rules__select-all" autocomplete="off" /></th><th></th><th class="rules__name">Name</th><th class="rules__title">Title</th>'];
        Typograf.prototype._rules.sort(function(a, b) {
            return a.name > b.name ? 1 : -1;
        }).forEach(function(rule, i) {
            var title = Typograf.prototype.titles[rule.name],
                checked = rule.enabled === false ? false : true;

            this._enabledByDefault[rule.name] = checked;

            html.push('<tr' + (checked ? ' class="rules__row_checked"' : '') + '>' +
                '<td class="rules__control"><input class="rules__checkbox" id="' + rule.name + '" type="checkbox" autocomplete="off" ' + (checked ? ' checked="checked" ' : '')+ '/></td>' +
                '<td class="rules__num">' + (i + 1) + '.</td>' +
                '<td class="rules__name">' + rule.name + '</td>' +
                '<td class="rules__title">' + (title.en || title.common) + '</td></tr>');
        }, this);

        return html.join('');
    },
    _checked: function(checkbox, checked) {
        var tr = checkbox.parentNode.parentNode;
        checkbox.checked = checked;
        if(checked) {
            tr.classList.add('rules__row_checked');
        } else {
            tr.classList.remove('rules__row_checked');
        }
    },
    _events: function() {
        var that = this;
        this._selectAll.addEventListener('click', function() {
            var chs = that._checkboxes;
            for(var i = 0; i < chs.length; i++) {
                that._checked(chs[i], this.checked);
            }

            that._updateSource();
        }, false);

        document
            .querySelector('.controls__default')
            .addEventListener('click', function() {
                that._selectAll.checked = false;
                var chs = that._checkboxes;
                Typograf.prototype._rules.forEach(function(rule) {
                    that._checked(document.getElementById(rule.name), rule.enabled !== false);
                });

                that._updateSource();
            }, false);

        document
            .querySelector('.rules')
            .addEventListener('click', function(e) {
            if(e.target.className !== 'rules__checkbox') {
                return;
            }

            var chs = that._checkboxes,
                count = 0;
            for(var i = 0; i < chs.length; i++) {
                if(chs[i].checked) {
                    count++;
                }
            }

            that._selectAll.checked = count === Typograf.prototype._rules.length;

            that._updateSource();
        }, false);

        document
            .querySelector('.result__textarea')
            .addEventListener('click', function() {
                this.select();
            }, false);
    },
    _delDefaultEnabledRules: function(rules) {
        var buf = [];
        rules.forEach(function() {
        });
    },
    _updateSource: function() {
        var enabled = [],
            disabled = [],
            chs = this._checkboxes;

        for(var i = 0; i < chs.length; i++) {
            var ruleName = chs[i].id;
            if(chs[i].checked && !defaultEnabled[ruleName]) {
                enabled.push(ruleName);
            }

            if(!chs[i].checked && defaultEnabled[ruleName]) {
                disabled.push(ruleName);
            }
        }

        document.querySelector('.result__textarea').value = this._getSource(enabled, disabled);
    },
    _getSource: function(enabled, disabled) {
        var text = 'var t = new Typograf();\n',
            pad = '\n    ',
            enable = [],
            disable = [];

        if(enabled.length) {
            enabled.sort().forEach(function(rule) {
                enable.push('"' + rule + '"');
            });

            text += 't.enable([' + enable.join(',' + pad) + ']);\n';
        }

        if(disabled.length) {
            disabled.sort().forEach(function(rule) {
                disable.push('"' + rule + '"');
            });

            text += 't.disable([' + disable.join(',' + pad) + ']);\n';
        }

        return text;
    }
};

App.init();

})();