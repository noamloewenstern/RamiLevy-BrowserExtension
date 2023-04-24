import { configBucket } from '~/config';
import { useState, useEffect } from 'react';
import Switch from './Switch';

export default function EnableReportErrorPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    function updateFromConfig() {
      configBucket.get('enableReportErrorPage').then(({ enableReportErrorPage = false }) => {
        setIsEnabled(enableReportErrorPage);
      });
    }
    updateFromConfig();
  }, []);
  return (
    <Switch
      label='Enable Report Error Page'
      value={isEnabled}
      onChange={v => {
        setIsEnabled(v);
        configBucket.set({ enableReportErrorPage: v });
      }}
    />
  );
}
