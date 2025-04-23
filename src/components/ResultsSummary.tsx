
import React from 'react';
import {
  Chart,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Card } from "@/components/ui/card";

// Register Chart.js components
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ScoresProps {
  quality: number;
  reputation: number;
  sustainability: number;
  innovation: number;
  customerService: number;
}

interface ResultsSummaryProps {
  title: string;
  description: string;
  scores: ScoresProps;
  isLoading?: boolean;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  title,
  description,
  scores,
  isLoading = false,
}) => {
  
  const defaultScores: ScoresProps = {
    quality: 0,
    reputation: 0,
    sustainability: 0,
    innovation: 0,
    customerService: 0
  };
  
  // Use defaultScores if scores is an empty object
  const validScores = Object.keys(scores).length === 0 ? defaultScores : scores;
  
  const data = {
    labels: ['Quality', 'Reputation', 'Sustainability', 'Innovation', 'Customer Service'],
    datasets: [
      {
        label: 'Brand Score',
        data: [
          validScores.quality,
          validScores.reputation,
          validScores.sustainability,
          validScores.innovation,
          validScores.customerService,
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: 'rgba(100, 100, 100, 1)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Card className="p-6 h-full overflow-hidden">
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex-grow flex items-center justify-center w-full">
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-48 w-48 rounded-full bg-muted"></div>
              <div className="mt-4 h-4 w-32 bg-muted rounded"></div>
            </div>
          ) : (
            <div className="w-full max-w-md mx-auto">
              <Radar data={data} options={options} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResultsSummary;
