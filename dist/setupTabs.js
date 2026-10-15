function setupTabs ()
{
    document.querySelectorAll(".tab-btn").forEach(button=>
    {
        button.addEventListener("click",()=>
            {
                const tabButtons = button.parentElement;
                const tabs = tabButtons.parentElement;
                const tabName = button.dataset.forTab;
                const tabActivate = tabs.querySelector(`.tab-content[data-tab="${tabName}"]`);

                tabButtons.querySelectorAll(".tab-btn").forEach(button=>
                    {
                        button.classList.remove("tab-btn-active");
                    });
                tabs.querySelectorAll(".tab-content").forEach(tab=>
                    {
                        tab.classList.remove("tab-content-active");
                    });
                button.classList.add("tab-btn-active");
                tabActivate.classList.add("tab-content-active");
                
            })    
    })
}

document.addEventListener("DOMContentLoaded",()=>
    {
        setupTabs();
    });
