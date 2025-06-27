
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

function App() {
  const [counterValue, setCounterValue] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleOperation = async (operation: 'increment' | 'decrement' | 'reset') => {
    setIsLoading(true);
    
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      let newValue: number;
      switch (operation) {
        case 'increment':
          newValue = counterValue + 1;
          break;
        case 'decrement':
          newValue = counterValue - 1;
          break;
        case 'reset':
          newValue = 0;
          break;
        default:
          newValue = counterValue;
      }
      
      setCounterValue(newValue);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to update counter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Counter App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counter Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {counterValue}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleOperation('decrement')}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="h-12 text-lg font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              −
            </Button>
            
            <Button
              onClick={() => handleOperation('reset')}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="h-12 text-sm font-semibold hover:bg-gray-100 hover:border-gray-400"
            >
              Reset
            </Button>
            
            <Button
              onClick={() => handleOperation('increment')}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="h-12 text-lg font-semibold hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            >
              +
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-gray-500">
              Updating counter...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
