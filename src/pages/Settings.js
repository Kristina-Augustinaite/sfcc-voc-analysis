import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #212529;
`;

const SettingsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  max-width: 800px;
`;

const SettingSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: #343a40;
  font-size: 1.25rem;
`;

const SettingRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SettingLabel = styled.label`
  font-weight: 500;
  color: #495057;
  flex: 0 0 200px;
  margin-right: 1rem;
  
  @media (max-width: 576px) {
    margin-bottom: 0.5rem;
  }
`;

const SettingInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  flex-grow: 1;
  max-width: 400px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SettingSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
  flex-grow: 1;
  max-width: 400px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SettingToggle = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: #007bff;
  }
  
  input:checked + &:before {
    transform: translateX(26px);
  }
`;

const SaveButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

const Settings = () => {
  const [settings, setSettings] = useState({
    apiEndpoint: 'https://api.example.com/reviews',
    refreshInterval: '30',
    theme: 'light',
    notifications: true,
    exportFormat: 'csv'
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the settings to some storage
    alert('Settings saved!');
  };
  
  return (
    <PageContainer>
      <Title>Settings</Title>
      
      <SettingsContainer>
        <form onSubmit={handleSubmit}>
          <SettingSection>
            <SectionTitle>API Configuration</SectionTitle>
            <SettingRow>
              <SettingLabel htmlFor="apiEndpoint">API Endpoint</SettingLabel>
              <SettingInput
                type="text"
                id="apiEndpoint"
                name="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={handleChange}
              />
            </SettingRow>
            <SettingRow>
              <SettingLabel htmlFor="refreshInterval">Refresh Interval (minutes)</SettingLabel>
              <SettingInput
                type="number"
                id="refreshInterval"
                name="refreshInterval"
                min="5"
                max="120"
                value={settings.refreshInterval}
                onChange={handleChange}
              />
            </SettingRow>
          </SettingSection>
          
          <SettingSection>
            <SectionTitle>Display Settings</SectionTitle>
            <SettingRow>
              <SettingLabel htmlFor="theme">Theme</SettingLabel>
              <SettingSelect
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </SettingSelect>
            </SettingRow>
            <SettingRow>
              <SettingLabel htmlFor="notifications">Enable Notifications</SettingLabel>
              <SettingToggle>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                  />
                  <ToggleSlider />
                </ToggleSwitch>
              </SettingToggle>
            </SettingRow>
          </SettingSection>
          
          <SettingSection>
            <SectionTitle>Export Settings</SectionTitle>
            <SettingRow>
              <SettingLabel htmlFor="exportFormat">Export Format</SettingLabel>
              <SettingSelect
                id="exportFormat"
                name="exportFormat"
                value={settings.exportFormat}
                onChange={handleChange}
              >
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="json">JSON</option>
                <option value="pdf">PDF</option>
              </SettingSelect>
            </SettingRow>
          </SettingSection>
          
          <SaveButton type="submit">Save Settings</SaveButton>
        </form>
      </SettingsContainer>
    </PageContainer>
  );
};

export default Settings; 