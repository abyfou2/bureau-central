import React, { useState } from 'react';
import { ApprovalConfig } from '../types';
import { Sliders, X, ShieldCheck } from 'lucide-react';

interface ApprovalConfigModalProps {
  config: ApprovalConfig;
  onSaveConfig: (newConfig: ApprovalConfig) => void;
  onClose: () => void;
}

export const ApprovalConfigModal: React.FC<ApprovalConfigModalProps> = ({
  config,
  onSaveConfig,
  onClose
}) => {
  const [formData, setFormData] = useState<ApprovalConfig>(config);

  const handleChange = (deptKey: string, field: 'enabled' | 'thresholdAmount', value: any) => {
    setFormData({
      ...formData,
      [deptKey]: {
        ...(formData[deptKey] || { enabled: true, thresholdAmount: 100000 }),
        [field]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  const departments = [
    { key: 'Bureau', label: "Bureau d'Or" },
    { key: 'Restaurant', label: "Restaurant & Traiteur" },
    { key: 'Services diverses', label: "Services Divers" },
    { key: 'Fondation Ilyassa', label: "Fondation Ilyassa" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Seuils de Validation par le PDG</h3>
              <p className="text-xs text-slate-500">Définissez les montants au-delà desquels une dépense nécessite l'accord du PDG</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {departments.map((d) => {
              const deptCfg = formData[d.key] || { enabled: true, thresholdAmount: 100000 };
              return (
                <div key={d.key} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{d.label}</span>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deptCfg.enabled}
                        onChange={(e) => handleChange(d.key, 'enabled', e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span className="font-medium">Validation PDG active</span>
                    </label>
                  </div>

                  {deptCfg.enabled && (
                    <div className="flex items-center gap-3">
                      <label className="text-[11px] text-slate-600 font-medium whitespace-nowrap">Seuil de déclenchement (XOF) :</label>
                      <input
                        type="number"
                        value={deptCfg.thresholdAmount}
                        onChange={(e) => handleChange(d.key, 'thresholdAmount', Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: 150000"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
            >
              Enregistrer la configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
