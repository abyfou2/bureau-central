export function exportFinancialReport(departmentName: string, data: { title: string; totalRevenue: number; totalExpenses: number; netProfit: number; items: any[] }) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Rapport Financier - ${departmentName}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; font-family: serif; color: #0f172a; }
        .meta { font-size: 12px; color: #64748b; text-align: right; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
        .card-title { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; }
        .card-value { font-size: 20px; font-weight: bold; color: #0f172a; font-family: monospace; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
        th { background: #0f172a; color: #ffffff; font-weight: 600; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
        @media print {
          body { padding: 0; }
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">BureauCentral</div>
          <div style="font-size: 14px; font-weight: 600; color: #475569; margin-top: 4px;">Rapport Officiel — ${departmentName}</div>
        </div>
        <div class="meta">
          <div>Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
          <div>Plateforme de Gestion Intégrée</div>
        </div>
      </div>

      <div class="summary">
        <div class="card">
          <div class="card-title">Recettes / Entrées</div>
          <div class="card-value" style="color: #059669;">${data.totalRevenue.toLocaleString()} XOF</div>
        </div>
        <div class="card">
          <div class="card-title">Dépenses / Sorties</div>
          <div class="card-value" style="color: #dc2626;">${data.totalExpenses.toLocaleString()} XOF</div>
        </div>
        <div class="card">
          <div class="card-title">Résultat Net</div>
          <div class="card-value" style="color: ${data.netProfit >= 0 ? '#2563eb' : '#dc2626'};">${data.netProfit.toLocaleString()} XOF</div>
        </div>
      </div>

      <h3 style="font-size: 16px; font-family: serif; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Détail des Opérations & Transactions</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description / Référence</th>
            <th>Catégorie</th>
            <th>Montant (XOF)</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.length === 0 ? '<tr><td colspan="5" style="text-align: center; color: #94a3b8;">Aucune donnée enregistrée</td></tr>' : data.items.map(item => `
            <tr>
              <td>${item.date || '-'}</td>
              <td style="font-weight: bold; color: ${item.type === 'recette' || item.type === 'achat' ? '#059669' : '#dc2626'};">${item.type?.toUpperCase() || 'OPÉRATION'}</td>
              <td>${item.description || item.clientOrSupplier || '-'}</td>
              <td>${item.category || item.serviceType || 'Standard'}</td>
              <td style="font-family: monospace; font-weight: bold;">${(item.amount || item.totalAmount || 0).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <div>BureauCentral — Document certifié authentique</div>
        <div>Signature & Cachet de la Direction</div>
      </div>

      <script>
        window.onload = () => {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
