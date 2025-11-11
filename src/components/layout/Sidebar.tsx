import { Download, Upload, RotateCcw, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSquadStore } from '../../store/squadStore';
import { FORMATIONS } from '../../data/formations';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { getTheme, setTheme, type Theme } from '../../utils/theme';

export function Sidebar() {
  const formation = useSquadStore((state) => state.plan.formation);
  const setFormation = useSquadStore((state) => state.setFormation);
  const reset = useSquadStore((state) => state.reset);
  const exportPlan = useSquadStore((state) => state.export);
  const importPlan = useSquadStore((state) => state.import);
  const [theme, setThemeState] = useState<Theme>(getTheme());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  const handleExport = () => {
    const json = exportPlan();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fm-squad-plan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        importPlan(json);
      } catch (error) {
        alert('Failed to import plan. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="w-full md:w-64 lg:w-72 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 md:p-6 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-2 gap-">
        <div>
          <h1 className="text-xl md:text-xl font-bold text-gray-900 dark:text-white mb-2">
            FM Squad Planner
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Plan your squad depth</p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      <Card className="p-4">
        <Select
          label="Formation"
          value={formation}
          onChange={(e) => setFormation(e.target.value)}
        >
          {FORMATIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </Card>

      <Card className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Actions</h3>
        
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          onClick={handleExport}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Download size={16} />
          Export JSON
        </button>

        <label className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer">
          <Upload size={16} />
          Import JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Settings</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
      </Card>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={reset}
        title="Reset Squad Plan"
        message="Are you sure you want to reset the entire squad plan? This will delete all players and cannot be undone. Make sure you've exported your data if you want to keep a backup."
        confirmText="Reset"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

