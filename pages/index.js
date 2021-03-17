import Head from 'next/head'
import Image from 'next/image'
import Navbar from 'rsuite/lib/Navbar'
import Nav from 'rsuite/lib/Nav'
import Icon from 'rsuite/lib/Icon'
import Dropdown from 'rsuite/lib/Dropdown'
import Tag from 'rsuite/lib/Tag'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <Navbar appearance="subtle">
          <Navbar.Header>
            <a href="#" className="navbar-brand logo"><Image src="/logo.svg" alt="Gitopia logo" width={112} height={56}></Image></a>
          </Navbar.Header>
          <Navbar.Body>
            <Nav>
              <Nav.Item>Repositories</Nav.Item>     
              <Nav.Item>Proposals</Nav.Item>
              <Nav.Item>Issues</Nav.Item>              
            </Nav>
            <Nav pullRight>
              <Nav.Item><Tag color="violet">0 LORE</Tag></Nav.Item>
              <Dropdown icon={<Icon icon="user" />} title="Wallet Disconnected">
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
              </Dropdown>
            </Nav>
          </Navbar.Body>
        </Navbar>
      </main>
    </div>
  )
}
