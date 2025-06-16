// New section generation code
${guide.sections.map((section, sIndex) => {
    const isCollapsible = section.collapsible || guide.collapsible;
    return `
        <div class="guide-fullscreen-section">
            <div class="guide-fullscreen-section-header" 
                 onclick="window.lastWarNexus.toggleSection(${index}, ${sIndex})"
                 style="cursor: ${isCollapsible ? 'pointer' : 'default'}">
                <h3 class="guide-fullscreen-section-title">
                    ${isCollapsible ? `<span id="section-toggle-${index}-${sIndex}" class="section-toggle-icon">▼</span>` : ''}
                    ${section.title}
                </h3>
            </div>
            <div id="section-content-${index}-${sIndex}" class="guide-fullscreen-items" style="display: block;">
                ${section.items.map(item => {
                    if (typeof item === 'string') {
                        return `
                            <div class="guide-fullscreen-item">
                                <span class="guide-fullscreen-bullet importance-minor">•</span>
                                <span class="guide-fullscreen-text">${item}</span>
                            </div>
                        `;
                    } else {
                        const mainImportance = item.importance || 'minor';
                        return `
                            <div class="guide-fullscreen-item-group">
                                <div class="guide-fullscreen-main-item">
                                    <span class="guide-fullscreen-main-bullet importance-${mainImportance}">▶</span>
                                    <span class="guide-fullscreen-main-text">${item.main}</span>
                                </div>
                                ${(item.subPoints || item.points) ? `
                                    <div class="guide-fullscreen-sub-items">
                                        ${(item.subPoints || item.points).map(subPoint => {
                                            if (typeof subPoint === 'string') {
                                                return `
                                                    <div class="guide-fullscreen-sub-item">
                                                        <span class="guide-fullscreen-sub-bullet importance-minor">•</span>
                                                        <span class="guide-fullscreen-sub-text">${subPoint}</span>
                                                    </div>
                                                `;
                                            } else {
                                                const importance = subPoint.importance || 'minor';
                                                return `
                                                    <div class="guide-fullscreen-sub-item">
                                                        <span class="guide-fullscreen-sub-bullet importance-${importance}">•</span>
                                                        <span class="guide-fullscreen-sub-text">${subPoint.text || subPoint}</span>
                                                    </div>
                                                `;
                                            }
                                        }).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }
                }).join('')}
            </div>
        </div>
    `;
}).join('')}