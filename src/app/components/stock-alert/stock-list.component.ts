import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Stock {
  ticker: string;
  name: string;
  price: number;
}

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})

export class StockListComponent {
  searchTerm = '';
  stocks: Stock[] = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 192.32 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 128.15 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: 345.67 },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 265.12 },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 134.56 },
    { ticker: 'NFLX', name: 'Netflix Inc.', price: 420.10 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 480.22 },
    { ticker: 'META', name: 'Meta Platforms Inc.', price: 312.45 },
  ];

  groups: { name: string; stocks: Stock[] }[] = [];
  showGroupDialog: boolean = false;
  groupDialogStock: Stock | null = null;
  newGroupName: string = '';
  selectedGroupName: string = '';

  filteredStocks(): Stock[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return [];
    return this.stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(term) ||
      stock.name.toLowerCase().includes(term)
    );
  }

  addToGroup(stock: Stock) {
    if (this.groups.length === 0) {
      // No groups, prompt to create
      this.showGroupDialog = true;
      this.groupDialogStock = stock;
      this.selectedGroupName = '';
      this.newGroupName = '';
    } else {
      // Show dialog to select or create
      this.showGroupDialog = true;
      this.groupDialogStock = stock;
      this.selectedGroupName = this.groups[0].name;
      this.newGroupName = '';
    }
  }

  confirmAddToGroup() {
    if (!this.groupDialogStock) return;
    let groupName = this.selectedGroupName;
    if (this.newGroupName.trim()) {
      groupName = this.newGroupName.trim();
      // Create new group if doesn't exist
      if (!this.groups.find(g => g.name === groupName)) {
        this.groups.push({ name: groupName, stocks: [] });
      }
    }
    const group = this.groups.find(g => g.name === groupName);
    if (group && !group.stocks.find(s => s.ticker === this.groupDialogStock!.ticker)) {
      group.stocks.push(this.groupDialogStock);
    }
    this.closeGroupDialog();
  }

  closeGroupDialog() {
    this.showGroupDialog = false;
    this.groupDialogStock = null;
    this.newGroupName = '';
    this.selectedGroupName = '';
  }
}
