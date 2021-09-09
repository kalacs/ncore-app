const { networkInterfaces, platform } = require("os");

const getEthernetInterfaceName = (platform) =>
  new Map([
    ["linux", "eth0"],
    ["darwin", "en0"],
    ["win32", "Ethernet"],
  ]).get(platform);

function getAddressOfInterface() {
  const interfaces = networkInterfaces();
  const interface = getEthernetInterfaceName(platform());

  if (!(interface in interfaces)) {
    throw new Error(`Network interface ${interface} is not exists`);
  }

  const ipv4Address = interfaces[interface].find(
    ({ family }) => family === "IPv4"
  );

  if (!ipv4Address) {
    throw new Error(`IPV4Address has not found`);
  }

  return ipv4Address.address;
}

module.exports = function ipAddressResolver({
  interface = "eth0",
  host = "",
  port = 3000,
}) {
  return {
    interface,
    host: host || getAddressOfInterface(),
    port,
  };
};
