import { Routes, RouterModule } from "@angular/router";
import { FeedPage } from "./feed.page";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProgressBarComponent } from "src/app/components/progress-bar/progress-bar.component";
import { TimeAgoModule } from "src/app/modules/time-ago.module";

const routes: Routes = [
    {
        path: '',
        component: FeedPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TimeAgoModule
    ],
    declarations: [FeedPage, ProgressBarComponent]
})
export class FeedPageModule {}