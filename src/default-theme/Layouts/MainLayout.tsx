import { createElement } from 'react'
import { Link } from 'react-router-dom'
import { Content } from 'runtime/Content'
createElement
export function MainLayout() {
  return (
    <div>
      <>Mainlayout</>
      <Content></Content>
      <div>
        <Link to="guide">guide</Link>
      </div>
      <div>
        <Link to="guide/a">guide/a</Link>
      </div>
    </div>
  )
}