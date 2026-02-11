export default function OverviewLoading() {
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-bg-primary">
            {/* Left panel skeleton */}
            <div className="hidden lg:block w-64 border-r border-border-primary p-6">
                <div className="h-8 w-32 bg-bg-secondary rounded animate-pulse mb-8" />
                <div className="space-y-4">
                    <div className="h-5 w-full bg-bg-secondary rounded animate-pulse" />
                    <div className="h-5 w-3/4 bg-bg-secondary rounded animate-pulse" />
                    <div className="h-5 w-5/6 bg-bg-secondary rounded animate-pulse" />
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* User nav skeleton */}
                <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 border-b border-border-primary">
                    <div className="h-6 w-48 bg-bg-secondary rounded animate-pulse" />
                    <div className="h-8 w-8 bg-bg-secondary rounded-full animate-pulse" />
                </div>

                {/* Content skeleton */}
                <div className="flex-1 px-4 md:px-8 lg:px-12 py-6 md:py-8 overflow-y-auto">
                    <div className="max-w-5xl space-y-8">
                        {/* Subscriptions section skeleton */}
                        <div>
                            <div className="h-6 w-40 bg-bg-secondary rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 w-full bg-bg-secondary rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Orders section skeleton */}
                        <div>
                            <div className="h-6 w-36 bg-bg-secondary rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 w-full bg-bg-secondary rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Payment methods section skeleton */}
                        <div>
                            <div className="h-6 w-44 bg-bg-secondary rounded animate-pulse mb-4" />
                            <div className="flex gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-24 w-48 bg-bg-secondary rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
