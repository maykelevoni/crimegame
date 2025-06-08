import fs from "fs";
import path from "path";

const views = [
  { name: "HomeView", title: "Home" },
  { name: "ProstitutesView", title: "Prostitutes" },
  { name: "WeaponsView", title: "Weapons" },
  { name: "DrugsView", title: "Drugs" },
  { name: "FactoriesView", title: "Factories" },
  { name: "NightlifeView", title: "Nightlife" },
  { name: "BusinessesView", title: "Businesses" },
  { name: "HospitalView", title: "Hospital" },
  { name: "PrisonView", title: "Prison" },
  { name: "BankView", title: "Bank" },
  { name: "CasinoView", title: "Casino" },
  { name: "AlleyView", title: "Alley" },
  { name: "TasksView", title: "Tasks" },
  { name: "MessagesView", title: "Messages" },
  { name: "FriendsView", title: "Friends" },
  { name: "GangView", title: "Gang" },
  { name: "GymView", title: "Gym" },
  { name: "PlazaView", title: "Plaza" },
  { name: "SchoolView", title: "School" },
  { name: "TerritoriesView", title: "Territories" },
  { name: "ExtortionView", title: "Extortion" },
  { name: "ExtrasView", title: "Extras" },
];

const baseViewTemplate = (
  name: string,
  title: string
) => `import React from 'react';
import BaseView from '../BaseView';

const ${name} = () => {
  return (
    <BaseView title="${title}">
      <div className="cyber-border p-4">
        <p className="text-gray-400">Coming soon...</p>
      </div>
    </BaseView>
  );
};

export default ${name};
`;

const generateViews = () => {
  views.forEach(({ name, title }) => {
    const viewPath = path.join(
      __dirname,
      "..",
      "components",
      "views",
      name.toLowerCase().replace("view", "")
    );
    const filePath = path.join(viewPath, `${name}.tsx`);

    // Create directory if it doesn't exist
    if (!fs.existsSync(viewPath)) {
      fs.mkdirSync(viewPath, { recursive: true });
    }

    // Write the component file
    fs.writeFileSync(filePath, baseViewTemplate(name, title));
    console.log(`Created ${filePath}`);
  });
};

generateViews();
