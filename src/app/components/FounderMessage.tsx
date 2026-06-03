import { MessageSquare, Heart, Shield } from 'lucide-react';

interface FounderMessageProps {
  role: 'host' | 'participant' | 'employer';
}

export function FounderMessage({ role }: FounderMessageProps) {
  const messages = {
    host: {
      icon: Shield,
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgGradient: 'from-blue-50 via-blue-100/50 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/20 dark:to-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      text: (
        <>
          <p className="mb-4">
            This platform was built by a landlord who understands the challenges, risks, and responsibilities that come with hosting seasonal and international students.
          </p>
          <p className="mb-4">
            <strong>Good Hosts deserve protection too.</strong>
          </p>
          <p className="mb-4">
            You should be able to expect respect for your property, responsible behavior, clear communication, and transparency when welcoming people into your home.
          </p>
          <p>
            Our goal is not to make hosting harder. Our goal is to create a fair system where responsible Hosts can feel protected, supported, and confident.
          </p>
        </>
      )
    },
    participant: {
      icon: Heart,
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgGradient: 'from-purple-50 via-purple-100/50 to-purple-50 dark:from-purple-900/20 dark:via-purple-800/20 dark:to-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      text: (
        <>
          <p className="mb-4">
            This platform was built by a former J-1 participant who understands how overwhelming it can be to arrive in a new country with limited information, limited resources, and nowhere to turn when something goes wrong.
          </p>
          <p className="mb-4">
            You deserve safer housing, transparent rules, honest reviews, and access to trustworthy opportunities.
          </p>
          <p>
            Our goal is to replace uncertainty with transparency and make the experience safer, simpler, and more connected for future participants.
          </p>
        </>
      )
    },
    employer: {
      icon: MessageSquare,
      iconColor: 'text-green-600 dark:text-green-400',
      bgGradient: 'from-green-50 via-green-100/50 to-green-50 dark:from-green-900/20 dark:via-green-800/20 dark:to-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      text: (
        <>
          <p className="mb-4">
            Responsible Employers play a critical role in creating positive experiences for international students and seasonal workers.
          </p>
          <p className="mb-4">
            This platform is designed to support transparent expectations, clear communication, accountability, and stronger long-term relationships between Employers and Participants.
          </p>
          <p>
            Great Employers deserve access to reliable and accountable Participants.
          </p>
        </>
      )
    }
  };

  const message = messages[role];
  const Icon = message.icon;

  return (
    <div className={`bg-gradient-to-br ${message.bgGradient} border-2 ${message.borderColor} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-md">
            <Icon className={`w-6 h-6 ${message.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            A Note From the Founder
          </h3>
          <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {message.text}
          </div>

          {/* Signature */}
          <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
            <p className="text-sm italic text-slate-600 dark:text-slate-400">
              — The VOYA LINK Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
