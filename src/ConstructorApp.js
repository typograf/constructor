(function(React) {

var rules = Typograf.prototype._rules;
rules
    .sort(function(a, b) {
        return a.name > b.name;
    })
    .forEach(function(rule) {
        rule.checked = !rule.disabled;
    });

var ConstructorApp = React.createClass({
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
            return (<label>
                <input type="radio" onChange={this.onChangeLang} name="lang" value={lang.value} checked={this.state.lang === lang.value} key={lang.value} />{lang.text}
            </label>);
        };

        var createRule = function(rule, index) {
            var obj = Typograf.prototype.titles[rule.name],
                title = obj[this.state.lang] || obj.common;
            return (
                <tr 
                    className={rule.checked ? 'rules__row_checked' : ''}
                    key={rule.name}
                    onClick={this.onClickRow}
                >
                    <td className="rules__control">
                        <input
                            type="checkbox"
                            className="rules__checkbox"
                            checked={rule.checked}
                            id={rule.name}
                            onChange={this.onCheckRule}
                            autoComplete="off"
                        />
                    </td>
                    <td className="rules__num">{index + 1}.</td>
                    <td className="rules__name">{rule.name}</td>
                    <td className="rules__title">{title}</td>
                </tr>
            );
        };

        return (
            <div>
                <h1>{this.text('title')}</h1>
                <div className="controls">
                    <label className="controls__select-all"><input type="checkbox" onChange={this.onChangeAll} checked={this.state.selectedAll} />{this.text('selectAll')}</label>
                    {this.state.langs.map(createLang, this)}
                    <button className="controls__default" onClick={this.onDefault}>{this.text('defaultRules')}</button>
                </div>
                <div className="result">
                {this.text('result')}:<br />
                    <textarea 
                        className="result__textarea" 
                        ref="textarea" 
                        onClick={this.onClickTextarea} 
                        readOnly="readonly" 
                        autoComplete="off" 
                        rows="10" 
                        value={this.state.code}
                    ></textarea>
                </div>
                <table className="rules">
                    <tbody>
                        <ul>{this.state.rules.map(createRule, this)}</ul>
                    </tbody>
                </table>
            </div>
        );
    }
});

React.render(<ConstructorApp />, document.querySelector('.page'));

})(React);
