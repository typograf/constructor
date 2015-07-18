(function(React) {

var rules = Typograf.prototype._rules;
rules
    .sort(function(a, b) {
        return a.name > b.name;
    })
    .forEach(function(rule) {
        rule.checked = !rule.disabled;
    });

var ConstructorApp = React.createClass({displayName: "ConstructorApp",
    getInitialState: function() {
        var defaultLang = 'ru';
        return {
            selectedAll: false,
            lang: defaultLang,
            langs: [
                {
                    text: 'Ru',
                    value: 'ru'
                },
                {
                    text: 'En',
                    value: 'en'
                }
            ],
            code: this.getSource([], [], defaultLang),
            rules: rules
        };
    },
    onChangeLang: function(e) {
        if(e.target.checked) {
            this.setState({lang: e.target.value}, function() {
                this.updateSource();
            });
        }
    },
    onDefault: function() {
        this.state.rules.map(function(rule) {
            rule.checked = rule.disabled ? true : false;

            return rule;
        });

        this.setState({
            selectedAll: false,
            rules: rules
        }, function() {
            this.updateSource();
        });

    },
    onCheckRule: function(e) {
        var name = e.target.id,
            checkedCount = 0,
            count = 0,
            stateRules = this.state.rules.map(function(rule) {
                if(rule.name === name) {
                    rule.checked = e.target.checked;
                }

                if(rule.checked) {
                    checkedCount++;
                }

                count++;

                return rule;
            });

        this.setState({
            selectedAll: count === checkedCount,
            rules: stateRules
        }, function() {
            this.updateSource();
        });
    },
    onClickTextarea: function() {
        React.findDOMNode(this.refs.textarea).select();
    },
    onClickRow: function(e) {
    },
    onChangeAll: function(e) {
        var checked = e.target.checked,
            stateRules = this.state.rules.map(function(rule) {
                rule.checked = checked;

                return rule;
            });

        this.setState({
            selectedAll: checked,
            rules: stateRules
        }, function() {
            this.updateSource();
        });
    },
    getSource: function(enabled, disabled, lang) {
        var text = 'var t = new Typograf({lang: \'' + lang + '\'});\n',
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
    },
    text: function(id) {
        return {
            ru: {
                defaultRules: 'По умолчанию',
                result: 'Результирующий код',
                selectAll: 'Выбрать всё',
                title: 'Выберите правила для Типографа'
            },
            en: {
                defaultRules: 'Default',
                result: 'Code',
                selectAll: 'Select all',
                title: 'Select rules for Typograf'
            }

        }[this.state.lang][id];
    },
    updateSource: function() {
        var enabled = [],
            disabled = [];

        this.state.rules.forEach(function(rule) {
            var ruleName = rule.name;
            if(rule.checked && rule.disabled) {
                enabled.push(ruleName);
            }

            if(!rule.checked && !rule.disabled) {
                disabled.push(ruleName);
            }
        });

        this.setState({code: this.getSource(enabled, disabled, this.state.lang)});
    },
    render: function() {
        var createLang = function(lang) {
            return (React.createElement("label", null, 
                React.createElement("input", {type: "radio", onChange: this.onChangeLang, name: "lang", value: lang.value, checked: this.state.lang === lang.value, key: lang.value}), lang.text
            ));
        };

        var createRule = function(rule, index) {
            var obj = Typograf.titles[rule.name],
                title = obj[this.state.lang] || obj.common;
            return (
                React.createElement("tr", {
                    className: rule.checked ? 'rules__row_checked' : '', 
                    key: rule.name, 
                    onClick: this.onClickRow
                }, 
                    React.createElement("td", {className: "rules__control"}, 
                        React.createElement("input", {
                            type: "checkbox", 
                            className: "rules__checkbox", 
                            checked: rule.checked, 
                            id: rule.name, 
                            onChange: this.onCheckRule, 
                            autoComplete: "off"}
                        )
                    ), 
                    React.createElement("td", {className: "rules__num"}, index + 1, "."), 
                    React.createElement("td", {className: "rules__name"}, rule.name), 
                    React.createElement("td", {className: "rules__title"}, title)
                )
            );
        };

        return (
            React.createElement("div", null, 
                React.createElement("h1", null, this.text('title')), 
                React.createElement("div", {className: "controls"}, 
                    React.createElement("label", {className: "controls__select-all"}, React.createElement("input", {type: "checkbox", onChange: this.onChangeAll, checked: this.state.selectedAll}), this.text('selectAll')), 
                    this.state.langs.map(createLang, this), 
                    React.createElement("button", {className: "controls__default", onClick: this.onDefault}, this.text('defaultRules'))
                ), 
                React.createElement("div", {className: "result"}, 
                this.text('result'), ":", React.createElement("br", null), 
                    React.createElement("textarea", {
                        className: "result__textarea", 
                        ref: "textarea", 
                        onClick: this.onClickTextarea, 
                        readOnly: "readonly", 
                        autoComplete: "off", 
                        rows: "10", 
                        value: this.state.code
                    })
                ), 
                React.createElement("table", {className: "rules"}, 
                    React.createElement("tbody", null, 
                        React.createElement("ul", null, this.state.rules.map(createRule, this))
                    )
                )
            )
        );
    }
});

React.render(React.createElement(ConstructorApp, null), document.querySelector('.page'));

})(React);
