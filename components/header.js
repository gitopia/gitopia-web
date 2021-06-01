import Image from "next/image";
import {
  Navbar,
  Nav,
  Icon,
  Dropdown,
  Tag,
  InputGroup,
  AutoComplete,
} from "rsuite";

const data = ["gitopia", "git-remote-gitopia", "gitopia-mirror-action"];

export default function Header() {
  return (
    <Navbar appearance="subtle">
      <Navbar.Header>
        <a href="/" className="navbar-brand logo">
          <Image
            src="/logo-white.svg"
            alt="Gitopia logo"
            width={112}
            height={56}
          ></Image>
        </a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <InputGroup
            inside
            style={{ width: 350, display: "inline-flex", margin: 10 }}
          >
            <AutoComplete
              data={data}
              placeholder="Search repositories / wallets"
            />
            <InputGroup.Addon>
              <Icon icon="search" />
            </InputGroup.Addon>
          </InputGroup>
          <Nav.Item>Repositories</Nav.Item>
          <Nav.Item>Proposals</Nav.Item>
          <Nav.Item>Issues</Nav.Item>
        </Nav>
        <Nav pullRight>
          <Nav.Item>
            <Tag color="violet">0 LORE</Tag>
          </Nav.Item>
          <Dropdown icon={<Icon icon="user" />} title="Wallet Disconnected">
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
          </Dropdown>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}
