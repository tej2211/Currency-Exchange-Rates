"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RefreshCw, TrendingUp, TrendingDown, Plane, Home, Calculator } from "lucide-react"

interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

interface ExchangeRate {
  from: string
  to: string
  rate: number
  change: number
  lastUpdated: string
}

interface GovernmentFee {
  country: string
  feePercentage: number
  fixedFee: number
  description: string
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
]

const governmentFees: GovernmentFee[] = [
  { country: "USD", feePercentage: 2.5, fixedFee: 5, description: "US Treasury fee + processing" },
  { country: "EUR", feePercentage: 1.8, fixedFee: 3, description: "EU transaction fee" },
  { country: "GBP", feePercentage: 2.2, fixedFee: 4, description: "UK exchange fee" },
  { country: "JPY", feePercentage: 1.5, fixedFee: 200, description: "Japan financial services fee" },
  { country: "CAD", feePercentage: 2.0, fixedFee: 3.5, description: "Canadian banking fee" },
  { country: "AUD", feePercentage: 2.3, fixedFee: 4.5, description: "Australian transaction fee" },
  { country: "CHF", feePercentage: 1.2, fixedFee: 2, description: "Swiss banking fee" },
  { country: "CNY", feePercentage: 3.0, fixedFee: 10, description: "Chinese regulatory fee" },
  { country: "INR", feePercentage: 2.8, fixedFee: 50, description: "Indian RBI fee" },
  { country: "KRW", feePercentage: 2.1, fixedFee: 1000, description: "Korean exchange fee" },
]

export default function CurrencyExchangeApp() {
  const [homeCurrency, setHomeCurrency] = useState<string>("USD")
  const [visitingCurrency, setVisitingCurrency] = useState<string>("EUR")
  const [amount, setAmount] = useState<string>("1000")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock exchange rates - in a real app, this would come from an API
  const generateMockRates = (): ExchangeRate[] => {
    const baseRates: { [key: string]: number } = {
      "USD-EUR": 0.92,
      "USD-GBP": 0.79,
      "USD-JPY": 149.5,
      "USD-CAD": 1.35,
      "USD-AUD": 1.52,
      "USD-CHF": 0.88,
      "USD-CNY": 7.24,
      "USD-INR": 83.15,
      "USD-KRW": 1320.5,
      "EUR-USD": 1.09,
      "EUR-GBP": 0.86,
      "EUR-JPY": 162.8,
      "GBP-USD": 1.27,
      "GBP-EUR": 1.16,
      "JPY-USD": 0.0067,
      "CAD-USD": 0.74,
      "AUD-USD": 0.66,
      "CHF-USD": 1.14,
      "CNY-USD": 0.138,
      "INR-USD": 0.012,
      "KRW-USD": 0.00076,
    }

    return Object.entries(baseRates).map(([pair, rate]) => {
      const [from, to] = pair.split("-")
      const change = (Math.random() - 0.5) * 0.1 // Random change between -5% and +5%
      return {
        from,
        to,
        rate: rate * (1 + change),
        change: change * 100,
        lastUpdated: new Date().toLocaleTimeString(),
      }
    })
  }

  const refreshRates = async () => {
    setIsRefreshing(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setExchangeRates(generateMockRates())
    setLastUpdate(new Date().toLocaleTimeString())
    setIsRefreshing(false)
  }

  useEffect(() => {
    refreshRates()
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshRates, 30000)
    return () => clearInterval(interval)
  }, [])

  const getCurrentRate = (): number => {
    if (homeCurrency === visitingCurrency) return 1
    const rate = exchangeRates.find((r) => r.from === homeCurrency && r.to === visitingCurrency)
    return rate?.rate || 1
  }

  const getRateChange = (): number => {
    if (homeCurrency === visitingCurrency) return 0
    const rate = exchangeRates.find((r) => r.from === homeCurrency && r.to === visitingCurrency)
    return rate?.change || 0
  }

  const getGovernmentFee = (): GovernmentFee => {
    return governmentFees.find((f) => f.country === visitingCurrency) || governmentFees[0]
  }

  const calculateExchange = () => {
    const inputAmount = Number.parseFloat(amount) || 0
    const rate = getCurrentRate()
    const convertedAmount = inputAmount * rate

    const govFee = getGovernmentFee()
    const percentageFee = (convertedAmount * govFee.feePercentage) / 100
    const totalFees = percentageFee + govFee.fixedFee
    const finalAmount = convertedAmount - totalFees

    return {
      convertedAmount,
      percentageFee,
      fixedFee: govFee.fixedFee,
      totalFees,
      finalAmount,
      govFee,
    }
  }

  const getHomeCurrency = () => currencies.find((c) => c.code === homeCurrency)
  const getVisitingCurrency = () => currencies.find((c) => c.code === visitingCurrency)
  const calculation = calculateExchange()
  const rateChange = getRateChange()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Currency Exchange Calculator</h1>
          <p className="text-gray-600">Convert your home currency with real-time rates and government fees</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Exchange Calculator
              </CardTitle>
              <CardDescription>Enter your amount and select currencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home Country
                  </Label>
                  <Select value={homeCurrency} onValueChange={setHomeCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                            <span className="text-sm text-gray-500">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Visiting Country
                  </Label>
                  <Select value={visitingCurrency} onValueChange={setVisitingCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                            <span className="text-sm text-gray-500">{currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={refreshRates} disabled={isRefreshing} className="w-full" variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Updating Rates..." : "Refresh Rates"}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Results</CardTitle>
              <CardDescription>Current rate and breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Rate */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    1 {getHomeCurrency()?.symbol}
                    {homeCurrency} =
                  </span>
                  <Badge variant={rateChange >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                    {rateChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {rateChange >= 0 ? "+" : ""}
                    {rateChange.toFixed(2)}%
                  </Badge>
                </div>
                <span className="font-bold text-lg">
                  {getCurrentRate().toFixed(4)} {getVisitingCurrency()?.symbol}
                  {visitingCurrency}
                </span>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <span className="font-medium">
                    {getHomeCurrency()?.symbol}
                    {Number.parseFloat(amount || "0").toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Converted Amount:</span>
                  <span className="font-medium">
                    {getVisitingCurrency()?.symbol}
                    {calculation.convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="font-medium text-red-600">Government Fees:</div>
                  <div className="flex justify-between pl-4">
                    <span>Percentage Fee ({calculation.govFee.feePercentage}%):</span>
                    <span>
                      -{getVisitingCurrency()?.symbol}
                      {calculation.percentageFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Fixed Fee:</span>
                    <span>
                      -{getVisitingCurrency()?.symbol}
                      {calculation.fixedFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pl-4">{calculation.govFee.description}</div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Final Amount:</span>
                  <span className="text-green-600">
                    {getVisitingCurrency()?.symbol}
                    {calculation.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {lastUpdate && <div className="text-xs text-gray-500 text-center">Last updated: {lastUpdate}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Rate History/Info */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rate Information</CardTitle>
            <CardDescription>Live rates update every 30 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getCurrentRate().toFixed(4)}</div>
                <div className="text-sm text-gray-600">Current Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{calculation.govFee.feePercentage}%</div>
                <div className="text-sm text-gray-600">Government Fee</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {((calculation.finalAmount / calculation.convertedAmount) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Net Conversion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
