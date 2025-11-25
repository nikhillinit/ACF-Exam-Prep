# analyzing-financial-statements Skill

A comprehensive Claude skill for calculating and interpreting financial ratios from company financial statements. Perfect for investment analysis, due diligence, and financial health assessments.

## 🎯 What This Skill Does

This skill takes financial statement data (income statement, balance sheet, cash flow, and market data) and provides:

- **Comprehensive Ratio Calculations**: 25+ financial ratios across 5 categories
- **Industry-Specific Interpretations**: Benchmarks for Technology, Retail, Financial, Manufacturing, Healthcare
- **Actionable Recommendations**: Specific guidance based on ratio analysis
- **Professional Excel Reports**: Formatted reports with conditional formatting
- **Trend Analysis**: Historical comparison when multiple periods are provided

## 📊 Ratio Categories

### Profitability Ratios
- Return on Equity (ROE)
- Return on Assets (ROA)
- Gross Margin
- Operating Margin
- Net Margin

### Liquidity Ratios
- Current Ratio
- Quick Ratio (Acid Test)
- Cash Ratio

### Leverage Ratios
- Debt-to-Equity
- Interest Coverage
- Debt Service Coverage

### Efficiency Ratios
- Asset Turnover
- Inventory Turnover
- Receivables Turnover
- Days Sales Outstanding

### Valuation Ratios
- P/E Ratio (Price-to-Earnings)
- P/B Ratio (Price-to-Book)
- P/S Ratio (Price-to-Sales)
- EV/EBITDA
- PEG Ratio
- EPS (Earnings Per Share)
- Book Value Per Share

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### Basic Usage

```python
from financial_analyzer import FinancialAnalyzer

# Prepare your financial data
financial_data = {
    'income_statement': {
        'revenue': 5000000,
        'cost_of_goods_sold': 1500000,
        'operating_income': 1800000,
        'ebit': 1750000,
        'ebitda': 2100000,
        'interest_expense': 50000,
        'net_income': 1500000
    },
    'balance_sheet': {
        'total_assets': 8000000,
        'current_assets': 3500000,
        'cash_and_equivalents': 1500000,
        'accounts_receivable': 800000,
        'inventory': 400000,
        'current_liabilities': 1200000,
        'total_debt': 1000000,
        'current_portion_long_term_debt': 200000,
        'shareholders_equity': 6000000
    },
    'cash_flow': {
        'operating_cash_flow': 1600000,
        'investing_cash_flow': -500000,
        'financing_cash_flow': -200000
    },
    'market_data': {
        'share_price': 75,
        'shares_outstanding': 500000,
        'earnings_growth_rate': 0.15
    }
}

# Create analyzer with industry context
analyzer = FinancialAnalyzer(financial_data, industry='technology')

# Run comprehensive analysis
analysis = analyzer.analyze()

# Print summary
print(analyzer.print_summary())
```

### Expected Output

```
======================================================================
FINANCIAL ANALYSIS SUMMARY - TECHNOLOGY INDUSTRY
======================================================================

Overall Financial Health: Excellent
Score: 3.8/4.0
Company shows strong financial health across most metrics

KEY METRICS SNAPSHOT:
----------------------------------------
ROE: 25.00%
Net Margin: 30.00%
Current Ratio: 2.92
Debt-to-Equity: 0.17
P/E Ratio: 25.00
EPS: $3.00

TOP RECOMMENDATIONS:
----------------------------------------
1. Maintain current financial management practices
2. Consider strategic growth opportunities

======================================================================
```

## 📖 Usage Examples

### Example 1: Quick Analysis with Convenience Function

```python
from financial_analyzer import analyze_company

analysis = analyze_company(
    financial_data,
    industry='retail',
    print_summary=True
)
```

### Example 2: Get Individual Ratio Interpretations

```python
analyzer = FinancialAnalyzer(financial_data, industry='healthcare')
analyzer.calculate_all_ratios()

# Get specific ratio interpretation
roe_analysis = analyzer.get_interpretation('roe')
print(f"ROE Rating: {roe_analysis['rating']}")
print(f"Analysis: {roe_analysis['message']}")
print(f"Recommendation: {roe_analysis['recommendation']}")
```

### Example 3: Trend Analysis with Historical Data

```python
# Provide historical data for trend analysis
historical_data = {
    'roe': {
        'values': [0.18, 0.20, 0.22, 0.25],
        'periods': ['2021', '2022', '2023', '2024']
    },
    'debt_to_equity': {
        'values': [0.30, 0.25, 0.20, 0.17],
        'periods': ['2021', '2022', '2023', '2024']
    }
}

analyzer = FinancialAnalyzer(financial_data, industry='technology')
analysis = analyzer.analyze(historical_data=historical_data)

# Access trend analysis
trends = analysis['trend_analysis']
print(trends['roe'])
```

### Example 4: Export to Excel Report

```python
from financial_analyzer import FinancialAnalyzer
from excel_report import create_excel_report

# Analyze company
analyzer = FinancialAnalyzer(financial_data, industry='manufacturing')
analysis = analyzer.analyze()

# Create Excel report
analysis_data = {
    'industry': analyzer.industry,
    'ratios': analyzer.ratios,
    'current_analysis': analysis['current_analysis'],
    'overall_health': analysis['overall_health'],
    'recommendations': analysis['recommendations']
}

create_excel_report(
    analysis_data,
    'acme_corp_analysis.xlsx',
    'ACME Corporation'
)
```

### Example 5: Export to JSON

```python
analyzer = FinancialAnalyzer(financial_data, industry='financial')
analyzer.analyze()

# Export complete analysis to JSON
analyzer.export_to_json('financial_analysis.json')
```

### Example 6: Direct Ratio Calculations

```python
from calculate_ratios import FinancialRatioCalculator

calculator = FinancialRatioCalculator(financial_data)

# Calculate specific category
profitability = calculator.calculate_profitability_ratios()
print(f"ROE: {profitability['roe']*100:.2f}%")
print(f"Net Margin: {profitability['net_margin']*100:.2f}%")

# Calculate all ratios
all_ratios = calculator.calculate_all_ratios()
```

### Example 7: Industry-Specific Interpretation

```python
from interpret_ratios import RatioInterpreter

# Create interpreter for specific industry
interpreter = RatioInterpreter(industry='healthcare')

# Interpret a ratio
interpretation = interpreter.interpret_ratio('current_ratio', 2.5)
print(f"Rating: {interpretation['rating']}")
print(f"Message: {interpretation['message']}")
print(f"Recommendation: {interpretation['recommendation']}")
```

## 🏭 Supported Industries

The skill provides industry-specific benchmarks for:

- **Technology**: High margins, moderate leverage
- **Retail**: Lower margins, inventory-focused
- **Financial**: Different leverage standards
- **Manufacturing**: Asset-intensive operations
- **Healthcare**: High margins, regulatory considerations
- **General**: Industry-agnostic benchmarks

## 📊 Data Format

### Required Fields

#### Income Statement
```python
'income_statement': {
    'revenue': float,
    'cost_of_goods_sold': float,
    'operating_income': float,
    'ebit': float,  # Earnings Before Interest and Taxes
    'ebitda': float,  # Earnings Before Interest, Taxes, Depreciation, Amortization
    'interest_expense': float,
    'net_income': float
}
```

#### Balance Sheet
```python
'balance_sheet': {
    'total_assets': float,
    'current_assets': float,
    'cash_and_equivalents': float,
    'accounts_receivable': float,
    'inventory': float,
    'current_liabilities': float,
    'total_debt': float,
    'current_portion_long_term_debt': float,
    'shareholders_equity': float
}
```

#### Cash Flow (Optional)
```python
'cash_flow': {
    'operating_cash_flow': float,
    'investing_cash_flow': float,
    'financing_cash_flow': float
}
```

#### Market Data (Required for valuation ratios)
```python
'market_data': {
    'share_price': float,
    'shares_outstanding': float,
    'earnings_growth_rate': float  # As decimal, e.g., 0.15 for 15%
}
```

## 🎨 Excel Report Features

The generated Excel reports include:

1. **Executive Summary Sheet**
   - Overall financial health assessment
   - Key performance indicators
   - Top recommendations

2. **Detailed Ratios Sheet**
   - All calculated ratios by category
   - Formatted values (percentages, multiples, currency)

3. **Interpretations Sheet**
   - Ratio-by-ratio analysis
   - Color-coded ratings (green/yellow/red)
   - Specific recommendations

## ⚙️ Advanced Features

### Custom Interpretation

```python
from interpret_ratios import RatioInterpreter

class CustomInterpreter(RatioInterpreter):
    def custom_analysis(self, ratios):
        # Add your custom logic
        pass

interpreter = CustomInterpreter(industry='technology')
```

### Batch Processing

```python
companies = [
    {'name': 'Company A', 'data': data_a, 'industry': 'tech'},
    {'name': 'Company B', 'data': data_b, 'industry': 'retail'},
]

results = {}
for company in companies:
    analyzer = FinancialAnalyzer(company['data'], company['industry'])
    results[company['name']] = analyzer.analyze()
```

## 📝 Use Cases

1. **Investment Due Diligence**: Evaluate companies for potential investment
2. **Competitive Analysis**: Compare financial health across competitors
3. **Credit Assessment**: Assess creditworthiness and default risk
4. **M&A Analysis**: Support acquisition target evaluation
5. **Portfolio Monitoring**: Track financial health of portfolio companies
6. **Academic Research**: Analyze industry trends and patterns
7. **Consulting Projects**: Generate professional financial reports

## 🔧 Module Structure

```
AnalyzingFinancialStatements/
├── SKILL.md                    # Skill documentation
├── README.md                   # This file
├── requirements.txt            # Dependencies
├── calculate_ratios.py         # Core calculation engine
├── interpret_ratios.py         # Interpretation and benchmarking
├── financial_analyzer.py       # Main unified interface
└── excel_report.py            # Excel report generation
```

## 🚨 Limitations

- Requires accurate, complete financial data
- Industry benchmarks are general guidelines, not absolute standards
- Some ratios may not apply to all industries (e.g., inventory turnover for service companies)
- Historical data doesn't guarantee future performance
- Should be used alongside qualitative analysis

## 💡 Tips for Best Results

1. **Validate Data**: Ensure all financial figures are accurate before analysis
2. **Choose Right Industry**: Select the most appropriate industry for better benchmarking
3. **Use Historical Data**: Include multiple periods for trend analysis
4. **Consider Context**: Interpret ratios within business context and strategy
5. **Compare Peers**: Analyze multiple companies in same industry for comparison
6. **Flag Outliers**: Pay special attention to ratios significantly outside normal ranges

## 📚 Financial Ratio Reference

### Profitability Ratios
- **ROE** = Net Income / Shareholders' Equity
- **ROA** = Net Income / Total Assets
- **Gross Margin** = (Revenue - COGS) / Revenue
- **Operating Margin** = Operating Income / Revenue
- **Net Margin** = Net Income / Revenue

### Liquidity Ratios
- **Current Ratio** = Current Assets / Current Liabilities
- **Quick Ratio** = (Current Assets - Inventory) / Current Liabilities
- **Cash Ratio** = Cash / Current Liabilities

### Leverage Ratios
- **Debt-to-Equity** = Total Debt / Shareholders' Equity
- **Interest Coverage** = EBIT / Interest Expense
- **Debt Service Coverage** = Operating Income / Total Debt Service

### Efficiency Ratios
- **Asset Turnover** = Revenue / Total Assets
- **Inventory Turnover** = COGS / Inventory
- **Receivables Turnover** = Revenue / Accounts Receivable
- **DSO** = 365 / Receivables Turnover

### Valuation Ratios
- **P/E Ratio** = Share Price / EPS
- **P/B Ratio** = Share Price / Book Value per Share
- **P/S Ratio** = Market Cap / Revenue
- **EV/EBITDA** = Enterprise Value / EBITDA
- **PEG Ratio** = P/E Ratio / (Earnings Growth Rate × 100)

## 🤝 Contributing

This skill can be extended with:
- Additional industries and benchmarks
- More sophisticated trend analysis
- Integration with financial data APIs
- Enhanced visualization options
- Custom reporting templates

## 📄 License

This skill is provided for educational and analytical purposes. Users are responsible for ensuring data accuracy and appropriate use of analysis results.

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained by**: Your investment analysis team
