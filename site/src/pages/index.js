import React from 'react'
import { Link } from 'gatsby'
import 'bulma/css/bulma.css'

import Layout from '../components/layout'
import PaiBan from '../components/paiban'

const Rules = () => {
  return (
    <div className="content">
    <ul>
      <li>加護病房兩區（A區和C區），白班（0700-1900）和夜班（1900-0700），總共六個人輪</li>
      <li>星期一的個數盡量平均</li>
      <li>不可以夜班連白班（會變成連續工作24小時）</li>
      <li>盡量不跳區（像A白C白A白這種）</li>
      <li>有的人會有一些要求，像是要某幾天不上班之類的</li>
      <li>盡量不要卡一天或超過六天連上（會很累），班盡可能平均（每一種A區白夜班、C區白夜班）</li>
      <li>就是會有人預約放假，一個人2-3天為限，盡量滿足</li>
    </ul>
    </div>
  );
}

const IndexPage = () => (
  <Layout>
    <h1>簡易排班程式</h1>
    <Rules />
    <PaiBan />
  </Layout>
)

export default IndexPage
