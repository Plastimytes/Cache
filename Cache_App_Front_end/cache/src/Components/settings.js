import React, { useState, useEffect } from "react";

const Settings = () => {
  // Load initial profile and settings from localStorage or defaults
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : { name: '', email: '' };
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { darkMode: false, notifications: false };
  });

  // Apply dark mode class to body on settings.darkMode change
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [settings.darkMode]);

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle settings checkbox changes
  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  // Save profile to localStorage
  const saveProfile = () => {
    if (profile.name.trim() === '' || profile.email.trim() === '') {
      alert('Please fill in all profile fields.');
      return;
    }
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Profile saved successfully!');
  };

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  // Export transactions as CSV
  const exportTransactions = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    if (transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }

    const csvHeader = 'Date,Type,Description,Amount,Category\n';
    const csvContent = transactions.map(t =>
      `${t.date},${t.type},${t.description},${t.amount},${t.category}`
    ).join('\n');

    const csv = csvHeader + csvContent;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);

    alert('Transactions exported successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-4">
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <button
          onClick={saveProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleSettingsChange}
            className="mr-2"
          />
          Dark Mode
        </label>
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleSettingsChange}
            className="mr-2"
          />
          Enable Notifications
        </label>
        <button
          onClick={saveSettings}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Export Data</h2>
        <button
          onClick={exportTransactions}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Transactions as CSV
        </button>
      </section>
    </div>
  );
};

export default Settings;