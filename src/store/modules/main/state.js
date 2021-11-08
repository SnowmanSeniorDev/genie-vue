const state = () => {
  return {
    darkMode: false,
    menu: [],
    permissions: [],
    ecoSystem: [],
    defaultEcosystem: {
      ecosystemId: '00000000-0000-0000-0000-000000000000',
      name: 'Public ecosystem'
    }
  };
};

export default state;
