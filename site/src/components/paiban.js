import React, { Component } from 'react'
import MersenneTwister from 'mersenne-twister'

const GetColor = (idx) => {
    const arr = ["#FF0018", "#FFC73E", "#BFBFBF",
            "#A267CA", "#00CDFB", "#00AD5B"]
    return arr[idx];
}
const DisplayIndex = ({idx}) => {
    const c = String.fromCharCode(idx + 65);
    return (<span>{c}</span>)
}

class Person extends Component {
    constructor() {
        super();
    }
    render() {
        const sol = this.props.sol;
        const idx = this.props.idx;
        const stats = [0, 0, 0, 0];
        const statsList = [];
        if (sol) {
            for (var i=0;i<sol.length;i++)
                for (var j=0;j<sol[i].length;j++)
                    if (sol[i][j] === idx)
                        stats[j]++;
            for (i=0;i<stats.length;i++)
                statsList.push(<span key={i}>{stats[i]} </span>)
        }
        return (
            <article className="media">
                <figure className="media-left">
                <p className="image is-64x64">
                <img src="https://bulma.io/images/placeholders/128x128.png" />
                </p>
                </figure>
                <div className="media-content">
                    <div className="content">
                    <div
                        style={{
                            backgroundColor: GetColor(idx),
                            textAlign: "center"
                        }}>
                        <strong><DisplayIndex idx={idx} />.</strong>
                    </div>
                    <div>
                        {statsList}
                    </div>
                    </div>
                </div>
            </article>
        )
    }
}

class PeoplePanel extends Component {
    constructor() {
        super();
    }
    render() {
        const seed = this.props.seed;
        const sol = this.props.sol;
        const N = this.props.N;
        const plist = []
        var i
        for (i = 0; i < N; i++) {
            plist.push((<Person key={i} idx={i} seed={seed} sol={sol} />))
        }
        return (<div>
            {plist}
        </div>)
    }
}

const DisplayYear = ({ year }) => (
    <span>{year} 年</span>
)
const DisplayMonth = ({ month }) => (
    <span>{month+1} 月</span>
)
const DisplayDay = ({ day }) => {
    const arr = ["日", "一", "二", "三", "四", "五", "六"]
    return (<span>({arr[day]})</span>)
}

class DatePanel extends Component {
    render() {
        const year = this.props.year;
        const month = this.props.month;
        const numOfDays = this.props.numOfDays;
        const day = new Date(year, month, 1).getDay();
        const sol = this.props.sol;
        const body = []
        var i, j
        for (i = 1; i <= numOfDays; i++) {
            var holder = []
            if (sol && sol[i]) {
                for (j=0;j<sol[i].length;j++)
                    holder.push(
                        <td key={j}
                            style={{backgroundColor: GetColor(sol[i][j])}}>
                            <DisplayIndex idx={sol[i][j]}/>
                        </td>
                    )
            }
            body.push(
                <tr key={i}>
                    <td style={{textAlign: "center"}}>{i} <DisplayDay day={(day+i-1)%7}/></td>
                    {holder}
                </tr>
            )
        }
        const tableframe = (
            <table className="table">
            <thead><tr>
                <th>日</th>
                <th>A區白班</th>
                <th>A區晚班</th>
                <th>C區白班</th>
                <th>C區晚班</th>
                </tr></thead>
            <tbody>
                {body}
            </tbody>
            </table>
        )
        return (<div>
            {tableframe}
        </div>)
    }
}

class PaiBan extends Component {
    constructor() {
        super();
        const now = new Date();
        var nextMonth;
        nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const year = nextMonth.getFullYear();
        const month = nextMonth.getMonth();
        const numOfDays = new Date(year, month, 0).getDate();
        this.state = {
            seed: 0,
            N: 6,
            year: year,
            month: month,
            numOfDays: numOfDays,
        }
    }
    updateN() {
        const state = Object.assign({}, this.state)
        state.N = parseInt(this.inputN.value)
        this.setState(state);
    }
    updateSeed() {
        const state = Object.assign({}, this.state)
        state.seed = parseInt(this.inputSeed.value)
        this.setState(state);
    }
    changeSeed() {
        const state = Object.assign({}, this.state)
        state.seed = parseInt(Math.floor(Math.random() * 65536))
        state.isLoading = true;
        this.setState(state);
        setTimeout(this.buildSolution.bind(this), 10);
    }
    buildSolution() {
        const state = Object({}, this.state)
        state.isLoading = true;
        this.setState(state);

        var seekSolution = function() {

            const rng = new MersenneTwister(this.state.seed)

            const SPOTS_PER_DAY = 4;
            var t = this.state.numOfDays;
            var N = this.state.N;
            var sol = [];
            var i, k, tmp
            var personDayCount = [];
            var dayPersonMark = [];
            for (i=0;i<N;i++) personDayCount.push([0,0,0,0])

            var choices = [];
            var blah = function(now) {
                if (now.length == SPOTS_PER_DAY) {
                    choices.push(now.slice());
                    return;
                }
                for(var j=0;j<N;j++) {
                    var bad=0;
                    for(var k=0;k<now.length;k++)
                    if(now[k] === j) bad=1;
                    if(bad === 0) {
                        now.push(j)
                        blah(now)
                        now.pop();
                    }
                }
            };
            blah([]);
            for (i = 1; i < choices.length; i++) {
                k = rng.random_int() % (i+1)
                tmp = choices[i]
                choices[i] = choices[k]
                choices[k] = tmp
            }

            /* returns true if next can be appended to today. */
            var canput = function(sol, t, N, pdc, dpm, today, next) {
                // 夜班連白斑
                if (next[0] === today[1] || next[0] === today[3] ||
                    next[2] === today[1] || next[2] === today[3])
                    return false;
                // 總數量 不能超過總平均數 2 天.
                for (var i=0;i<SPOTS_PER_DAY;i++) {
                    if (pdc[next[i]][i] + 1 > t / N + 1)
                        return false;
                }
                // 總班數 不能超過總平均數 2 天.
                for (var i=0;i<SPOTS_PER_DAY;i++) {
                    if (pdc[next[i]][0]+pdc[next[i]][1]+pdc[next[i]][2]+pdc[next[i]][3] > t*SPOTS_PER_DAY/N+1)
                        return false;
                }
                // TODO: 連續 6 天
                for (i=0;i<SPOTS_PER_DAY;i++) {
                    var cnt=0;
                    for (var j=Math.max(sol.length-6, 1);j<sol.length;j++)
                        cnt += dpm[j][next[i]]
                    if (cnt == 6)
                        return false;
                }
                
                // TODO: 放假
                return true;
            }

            var addToPDC = function(pdc, next) {
                for (var i=0;i<SPOTS_PER_DAY;i++)
                    pdc[next[i]][i]++;
            }
            var removeFromPDC = function(pdc, next) {
                for (var i=0;i<SPOTS_PER_DAY;i++)
                    pdc[next[i]][i]--;
            }
            var makeDayPersonVector = function(next) {
                var ret = [];
                for (var i=0;i<N;i++) ret.push(0);
                for (var i=0;i<SPOTS_PER_DAY;i++)
                    if (next[i] >= 0)
                        ret[next[i]] = 1;
                return ret;
            }

            /* returns true if a solution is found. */
            var timecut = 0;
            var badtimecut = 0;
            var dfs = function(today) {
                var j;
                sol.push(today);
                dayPersonMark.push(makeDayPersonVector(today))
                
                timecut += 1;
                if (timecut >= 200000) {
                    badtimecut = 1;
                    return true;
                }
                    

                // 已經建立完畢!
                if (sol.length === t+1) {
                    return true;
                }

                for (var i = 0; i < choices.length; i++) {
                    if (canput(sol, t, N, personDayCount,
                            dayPersonMark, today, choices[i])) {
                        addToPDC(personDayCount, choices[i]);
                        if (dfs(choices[i])) {
                            return true;
                        }
                        removeFromPDC(personDayCount, choices[i]);
                    }
                }
                sol.pop();
                dayPersonMark.pop();
                return false;
            }
            dfs([-1,-1,-1,-1])
            


            const state = Object.assign({}, this.state)
            if (badtimecut) {
                state.msg = "失敗了，請選另一個亂數種子！"
                state.sol = undefined
                state.isLoading = undefined   
            } else {
                state.msg = undefined
                state.sol = sol
                state.isLoading = undefined
            }
            this.setState(state);
        };

        setTimeout(seekSolution.bind(this), 0);
    }
    render() {
        return (
            <div className="content">
            <div className="box">
                <div className="columns">
                <div className="column">
                <div className="field">
                <label className="label">人數</label>
                    <div className="control">
                        <input
                            ref={(e)=>this.inputN=e}
                            className="input"
                            value={this.state.N}
                            onChange={this.updateN.bind(this)}
                        />
                    </div>
                </div>
                </div>
                <div className="column">
                <div className="field is-6">
                <label className="label">亂數種子</label>
                    <div className="control">
                        <input
                            ref={(e)=>this.inputSeed=e}
                            className="input"
                            value={this.state.seed}
                            onChange={this.updateSeed.bind(this)}
                        />

                    </div>
                </div>
                </div>
                </div>
                <div>
                    <button
                        className={
                            "button is-primary " +
                            (this.state.isLoading? "is-loading": "")
                        }
                        onClick={this.buildSolution.bind(this)}
                    >建立班表</button>{" "}
                    <button
                        className={
                            "button is-info " +
                            (this.state.isLoading? "is-loading": "")
                        }
                        onClick={this.changeSeed.bind(this)}
                    >換個種子</button>
                    { this.state.msg &&
                    (<span className="is-warning">{this.state.msg}</span>)}
                </div>
                
                
            </div>
            <div>排班就是我</div>
            <div className="columns">
            <div className="column is-one-quarter">
            <PeoplePanel
                ref={(e)=>this.peoplePanel=e}
                seed={this.state.seed}
                N={this.state.N}
                sol={this.state.sol}
                />
            </div>
            <div className="column">
            <h1 className="title">
                <DisplayYear year={this.state.year}/>{" "}
                <DisplayMonth month={this.state.month}/>
            </h1>
            <DatePanel
                year={this.state.year}
                month={this.state.month}
                numOfDays={this.state.numOfDays}
                sol={this.state.sol}
                />
            </div>
            </div>
            </div>
        )
    }
}

export default PaiBan